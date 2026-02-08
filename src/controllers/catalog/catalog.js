import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = async (req, res) => {
    // Model functions are async, so we must await them
    const courses = await getAllCourses();

    // UPDATED view path
    res.render('catalog/list', {
        title: 'Course Catalog',
        courses
    });
};

// Route handler for individual course detail pages (slug-based)
const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.slugId;

    // Model functions are async, so we must await them
    const course = await getCourseBySlug(courseSlug);

    // Our model returns empty object {} when not found
    if (Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Sorting handled by PostgreSQL
    const sortBy = req.query.sort || 'time';
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

    // view path
    res.render('catalog/detail', {
        title: `${course.courseCode} - ${course.name}`,
        course,
        sections,
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };
