const Course = require("./course.model");

// Get all training schedules for a specific course
exports.getCourseTrainingSchedules = async (req, res) => {
  try {
    const { id } = req.params; // course ID

    const course = await Course.findById(id).select("trainingSchedules title");
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Filter only active schedules
    const activeSchedules = course.trainingSchedules.filter(
      (schedule) => schedule.isActive
    );

    res.json({
      success: true,
      data: {
        courseId: course._id,
        courseTitle: course.title,
        trainingSchedules: activeSchedules,
      },
    });
  } catch (error) {
    console.error("Get training schedules error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get courses by training schedule (filter courses that have specific schedule criteria)
exports.getCoursesBySchedule = async (req, res) => {
  try {
    const { status, startDate, endDate, available } = req.query;
    
    const filter = { isActive: true };
    
    // Build query for training schedules
    const scheduleFilter = { "trainingSchedules.isActive": true };
    
    if (status) {
      scheduleFilter["trainingSchedules.status"] = status;
    }
    
    if (startDate) {
      scheduleFilter["trainingSchedules.startDate"] = { 
        $gte: new Date(startDate) 
      };
    }
    
    if (endDate) {
      scheduleFilter["trainingSchedules.endDate"] = { 
        $lte: new Date(endDate) 
      };
    }
    
    if (available === "true") {
      scheduleFilter["$expr"] = {
        $gt: [
          "$trainingSchedules.availableSeats",
          "$trainingSchedules.enrolledCount"
        ]
      };
    }

    const courses = await Course.find({
      ...filter,
      ...scheduleFilter,
    })
      .populate("category", "name")
      .select("title shortDescription mainImage price priceText trainingSchedules")
      .lean();

    // Filter training schedules in each course
    const filteredCourses = courses.map((course) => ({
      ...course,
      trainingSchedules: course.trainingSchedules.filter((schedule) => {
        let match = schedule.isActive;
        
        if (status && schedule.status !== status) match = false;
        if (startDate && new Date(schedule.startDate) < new Date(startDate)) match = false;
        if (endDate && new Date(schedule.endDate) > new Date(endDate)) match = false;
        if (available === "true" && schedule.enrolledCount >= schedule.availableSeats) match = false;
        
        return match;
      }),
    })).filter(course => course.trainingSchedules.length > 0);

    res.json({
      success: true,
      count: filteredCourses.length,
      data: filteredCourses,
    });
  } catch (error) {
    console.error("Get courses by schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add a new training schedule to a course
exports.addTrainingSchedule = async (req, res) => {
  try {
    const { id } = req.params; // course ID
    const { scheduleName, startDate, endDate, status, availableSeats } = req.body;

    if (!scheduleName) {
      return res.status(400).json({
        success: false,
        message: "Schedule name is required",
      });
    }

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newSchedule = {
      scheduleName,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || "upcoming",
      availableSeats: availableSeats ? Number(availableSeats) : undefined,
      enrolledCount: 0,
      isActive: true,
    };

    course.trainingSchedules.push(newSchedule);
    await course.save();

    const addedSchedule = course.trainingSchedules[course.trainingSchedules.length - 1];

    res.status(201).json({
      success: true,
      message: "Training schedule added successfully",
      data: addedSchedule,
    });
  } catch (error) {
    console.error("Add training schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a training schedule
exports.updateTrainingSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params; // course ID and schedule ID
    const updates = req.body;

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const schedule = course.trainingSchedules.id(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Training schedule not found",
      });
    }

    // Update fields
    if (updates.scheduleName) schedule.scheduleName = updates.scheduleName;
    if (updates.startDate) schedule.startDate = new Date(updates.startDate);
    if (updates.endDate) schedule.endDate = new Date(updates.endDate);
    if (updates.status) schedule.status = updates.status;
    if (updates.availableSeats !== undefined) schedule.availableSeats = Number(updates.availableSeats);
    if (updates.enrolledCount !== undefined) schedule.enrolledCount = Number(updates.enrolledCount);
    if (updates.isActive !== undefined) schedule.isActive = updates.isActive;

    await course.save();

    res.json({
      success: true,
      message: "Training schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Update training schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a training schedule
exports.deleteTrainingSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params; // course ID and schedule ID

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const schedule = course.trainingSchedules.id(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Training schedule not found",
      });
    }

    schedule.deleteOne();
    await course.save();

    res.json({
      success: true,
      message: "Training schedule deleted successfully",
    });
  } catch (error) {
    console.error("Delete training schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Increment enrolled count for a schedule (when someone applies)
exports.enrollInSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params; // course ID and schedule ID

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const schedule = course.trainingSchedules.id(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Training schedule not found",
      });
    }

    if (!schedule.isActive) {
      return res.status(400).json({
        success: false,
        message: "This training schedule is not active",
      });
    }

    if (schedule.availableSeats && schedule.enrolledCount >= schedule.availableSeats) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this training schedule",
      });
    }

    schedule.enrolledCount += 1;
    await course.save();

    res.json({
      success: true,
      message: "Successfully enrolled in training schedule",
      data: {
        scheduleId: schedule._id,
        scheduleName: schedule.scheduleName,
        enrolledCount: schedule.enrolledCount,
        availableSeats: schedule.availableSeats,
      },
    });
  } catch (error) {
    console.error("Enroll in schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = exports;

