
console.log(window.innerWidth)

// const saveText = ()=>{
//     const productNames = document.getElementsByClassName('product-name');
//     for(let nameElement of productNames){
//         nameElement.originalText = nameElement.innerText;
//         console.log(nameElement.originalText);
//         }
// }
const setProductName = () => {
    const productNames = document.getElementsByClassName('product-name');
    document.createAttribute('originalName')
    for (let nameElement of productNames) {
        nameElement.setAttribute('originalName', nameElement.innerText)
    }
}

const adjustName = () => {

    const productNames = document.getElementsByClassName('product-name');
    for (let nameElement of productNames) {
        if (window.innerWidth > 991) {
            nameElement.innerText = nameElement.getAttribute('originalName').slice(0, 20)

        }
        else {
            nameElement.innerText = nameElement.getAttribute('originalName')

            console.log(nameElement.getAttribute('originalName'))

        }
    }
}


// window.addEventListener('load',saveText,adjustName)
window.addEventListener('load', () => {
    setProductName();
    adjustName();
})

window.addEventListener('resize', adjustName);