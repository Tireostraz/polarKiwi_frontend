export interface Project{
  id: number,
  template: number,
}


export const useProjectsStore = defineStore('projects', ()=>{

  const projects = ref<Array<{project: Project; quantity: number}>>([])
  const totalProjects = computed(()=>projects.value.length)
  
  return{
    projects
    totalProjects
  }
});