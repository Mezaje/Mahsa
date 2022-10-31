const show_navmbile = document.getElementById('nav')

const navmobile = document.querySelector('.mobile')

const blackcover = document.querySelector('.blackcover')

show_navmbile.addEventListener('click',(e)=>{
   e.preventDefault()
   navmobile.style.width='70%'
   blackcover.style.display='flex'
})

blackcover.addEventListener('click',()=>{
  navmobile.style.width='0%'
  blackcover.style.display='none'
})





 window.addEventListener('resize',()=>{
   navmobile.style.width='0%'
   blackcover.style.display='none'
 })


