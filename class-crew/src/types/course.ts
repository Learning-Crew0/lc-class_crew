export interface TrainingSchedule {
    _id: string;
    scheduleName: string;
    startDate: string;
    endDate: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    availableSeats: number;
    enrolledCount: number;
    isActive: boolean;
}

export interface Course {
    id: string;
    _id?: string;
    title: string;
    description: string;
    shortDescription?: string;
    longDescription?: string;
    priceText?: string;
    price: string | number;
    date: string | Date;
    category:
        | string
        | {
              _id: string;
              title?: string;
              name?: string;
          };
    tagText: string;
    tagColor: string;
    tags: string[];
    image?: string;
    mainImage?: string;
    hoverImage?: string; // For hover background image
    target?: string;
    duration?: string;
    location?: string;
    level?: string;
    language?: string;
    isActive?: boolean;
    enrollmentCount?: number;
    averageRating?: number;
    whatYouWillLearn?: string[];
    requirements?: string[];
    trainingSchedules?: TrainingSchedule[];
    createdAt?: string;
    updatedAt?: string;
}
