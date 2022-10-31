const img = document.getElementById('main_img')
const imgs = document.querySelectorAll('.overview-circle img')
const productscollection = document.querySelector('.productscollections')
const search = document.getElementById('searchbutton')
const searchinput = document.getElementById('search')
const selectdata =document.getElementById('select')

imgs.forEach(e=>{
    e.addEventListener('click',()=>{
        img.src = e.src
    })
})

let datao = []

var nameit = []

const cartitem = document.querySelector('.productsofcart')
let cart = JSON.parse(localStorage.getItem('carts'))||[]

console.log(cart)

const data =()=> fetch('/BookList').then((res)=>{
    res.json().then(data=>{
        productshow(data)
        datao = data
        console.log(data)
        }
    )
})
//<i class="fa-regular fa-cart-shopping"></i>
const productshow=(pro)=>{
    let theproduct= pro.map((item)=>{
        return(
        `
            <div class="productcard">
                <img src=${item.metadata.Imgs} alt="">
                <h3>${item.metadata.name}</h3>
                <div class="card_details">
                    <a href="Book/${item.filename}"><button><i class="fa-solid fa-magnifying-glass"></i></button></a>
                </div>
            </div>
        `)
    })
    if (pro.length>0) {
        productscollection.innerHTML = theproduct
    } else {
        productscollection.innerHTML = '<h2>No Book With This Name</h2>'
    }
}


search.addEventListener('click',(e)=>{
    e.preventDefault()
})



searchinput.addEventListener('keyup',()=>{
    filters()
})

selectdata.addEventListener('change',()=>{
    filters()
})

data()



const filters=()=>{
        let type2 =document.getElementById('select').value
        let type1 =document.getElementById('search').value
        console.log(datao)
        const tdata = {name:type1,Category:type2}
        const the_filtering = datao.filter((item)=>item.metadata.name.includes(tdata.name)&&item.metadata.category.includes(tdata.Category))
        console.log(the_filtering,tdata)
        productshow(the_filtering)
}
