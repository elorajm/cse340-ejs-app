// Faculty controller
import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';


export function facultyListPage(req, res) {
  const sortBy = req.query.sort;
  const faculty = getSortedFaculty(sortBy);
  res.render('faculty/list', {
    title: 'Faculty Directory',
    faculty,
    sortBy
  });
}


export function facultyDetailPage(req, res) {
  const facultyId = req.params.facultyId;
  const facultyMember = getFacultyById(facultyId);
  if (!facultyMember) {
    return res.status(404).render('errors/404', { message: 'Faculty not found', title: 'Faculty Not Found' });
  }
  res.render('faculty/detail', {
    title: facultyMember.name + ' - Faculty Profile',
    faculty: facultyMember,
    facultyId
  });
}
