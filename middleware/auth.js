export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    console.log('Is admin:', isAdmin)
    console.log('Route:', to.path)
    
    if (to.path.startsWith('/dashboard') && !isAdmin) {
      console.log('Redirecting non-admin user from dashboard')
      return navigateTo('/')
    }
  }
})
