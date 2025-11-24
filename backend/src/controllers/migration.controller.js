const Course = require("../models/course.model");
const { successResponse } = require("../utils/response.util");
const { BASE_UPLOAD_PATH, getFileUrl } = require("../config/fileStorage");
const fs = require("fs");
const path = require("path");

/**
 * Move file from temp to courses folder
 */
const moveTempFileToCourses = (tempUrl) => {
    if (!tempUrl || !tempUrl.includes("/uploads/temp/")) {
        return { moved: false, newUrl: tempUrl, reason: "Not a temp file" };
    }

    try {
        // Extract filename from URL
        const filename = path.basename(tempUrl);
        
        // Construct file paths
        const tempPath = path.join(BASE_UPLOAD_PATH, "temp", filename);
        const coursesPath = path.join(BASE_UPLOAD_PATH, "courses", filename);
        
        // Check if temp file exists
        if (fs.existsSync(tempPath)) {
            // Move (rename) the file
            fs.renameSync(tempPath, coursesPath);
            
            // Return the new URL
            return { 
                moved: true, 
                newUrl: getFileUrl("COURSES", filename),
                reason: "Moved successfully"
            };
        } else if (fs.existsSync(coursesPath)) {
            // File already exists in courses folder
            return { 
                moved: false, 
                newUrl: getFileUrl("COURSES", filename),
                reason: "Already in courses folder"
            };
        } else {
            return { 
                moved: false, 
                newUrl: null,
                reason: "File not found in temp or courses folder"
            };
        }
    } catch (error) {
        return { 
            moved: false, 
            newUrl: null,
            reason: `Error: ${error.message}`
        };
    }
};

/**
 * Migrate temp images to permanent storage
 * Admin-only endpoint
 */
const migrateTempImages = async (req, res, next) => {
    try {
        console.log('🔍 Starting temp image migration...');
        
        // Find all courses with temp URLs
        const coursesWithTempImages = await Course.find({
            $or: [
                { mainImage: { $regex: '/uploads/temp/' } },
                { image: { $regex: '/uploads/temp/' } },
                { hoverImage: { $regex: '/uploads/temp/' } }
            ]
        });
        
        if (coursesWithTempImages.length === 0) {
            return successResponse(
                res,
                { migrated: 0, failed: 0, cleared: 0 },
                "No courses with temp images found"
            );
        }
        
        let migrated = 0;
        let failed = 0;
        let cleared = 0;
        const details = [];
        
        for (const course of coursesWithTempImages) {
            const courseDetails = {
                id: course._id,
                title: course.title,
                changes: []
            };
            
            let hadChanges = false;
            const updates = {};
            
            // Handle mainImage
            if (course.mainImage && course.mainImage.includes('/uploads/temp/')) {
                const result = moveTempFileToCourses(course.mainImage);
                courseDetails.changes.push({
                    field: 'mainImage',
                    ...result
                });
                
                if (result.moved) {
                    updates.mainImage = result.newUrl;
                    updates.image = result.newUrl;
                    hadChanges = true;
                } else if (!result.newUrl) {
                    updates.$unset = updates.$unset || {};
                    updates.$unset.mainImage = "";
                    updates.$unset.image = "";
                    hadChanges = true;
                    cleared++;
                }
            }
            
            // Handle hoverImage
            if (course.hoverImage && course.hoverImage.includes('/uploads/temp/')) {
                const result = moveTempFileToCourses(course.hoverImage);
                courseDetails.changes.push({
                    field: 'hoverImage',
                    ...result
                });
                
                if (result.moved) {
                    updates.hoverImage = result.newUrl;
                    hadChanges = true;
                } else if (!result.newUrl) {
                    updates.$unset = updates.$unset || {};
                    updates.$unset.hoverImage = "";
                    hadChanges = true;
                    cleared++;
                }
            }
            
            if (hadChanges) {
                try {
                    await Course.updateOne({ _id: course._id }, updates);
                    courseDetails.status = 'success';
                    migrated++;
                } catch (error) {
                    courseDetails.status = 'failed';
                    courseDetails.error = error.message;
                    failed++;
                }
            } else {
                courseDetails.status = 'no changes needed';
            }
            
            details.push(courseDetails);
        }
        
        return successResponse(
            res,
            {
                migrated,
                failed,
                cleared,
                totalProcessed: coursesWithTempImages.length,
                details
            },
            `Migration complete: ${migrated} courses updated, ${cleared} images cleared, ${failed} failed`
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    migrateTempImages
};





