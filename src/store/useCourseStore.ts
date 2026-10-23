import { create } from 'zustand'
import { COURSES, SUBJECT_META, LEVEL_META } from '../data/courses'
import type { Course, Subject, Level } from '../types'

interface CourseState {
  courses: Course[]
  filterSubject: Subject | 'all'
  filterLevel: Level | 'all'
  setFilterSubject: (s: Subject | 'all') => void
  setFilterLevel: (l: Level | 'all') => void
  getFilteredCourses: () => Course[]
  getCourseById: (id: string) => Course | undefined
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: COURSES,
  filterSubject: 'all',
  filterLevel: 'all',

  setFilterSubject: (s) => set({ filterSubject: s }),
  setFilterLevel: (l) => set({ filterLevel: l }),

  getFilteredCourses: () => {
    const { courses, filterSubject, filterLevel } = get()
    return courses.filter(
      (c) =>
        (filterSubject === 'all' || c.subject === filterSubject) &&
        (filterLevel === 'all' || c.level === filterLevel)
    )
  },

  getCourseById: (id) => COURSES.find((c) => c.id === id),
}))

export { SUBJECT_META, LEVEL_META }
