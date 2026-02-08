import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

// Faculty list page: /faculty?sort=name OR /faculty?sort=department
const facultyListPage = async (req, res, next) => {
  try {
    const sortBy = req.query.sort || 'name';

    // Model should return an array of faculty rows
    const faculty = await getSortedFaculty(sortBy);

    // Safety: guarantee the view always gets an array
    const facultyList = Array.isArray(faculty) ? faculty : [];

    res.render('faculty/list', {
      title: 'Faculty Directory',
      faculty: facultyList,
      currentSort: sortBy
    });
  } catch (err) {
    return next(err);
  }
};

// Faculty detail page: /faculty/:slugId
const facultyDetailPage = async (req, res, next) => {
  try {
    const facultySlug = req.params.slugId;

    const facultyMember = await getFacultyBySlug(facultySlug);

    // Model returns {} when not found
    if (!facultyMember || Object.keys(facultyMember).length === 0) {
      const err = new Error(`Faculty member ${facultySlug} not found`);
      err.status = 404;
      return next(err);
    }

    res.render('faculty/detail', {
      title: facultyMember.name,
      facultyMember
    });
  } catch (err) {
    return next(err);
  }
};

export { facultyListPage, facultyDetailPage };
