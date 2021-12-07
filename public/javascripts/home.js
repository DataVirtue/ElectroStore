


const searchBar = document.querySelector('.search')
const searchForm = document.querySelector('.form-search')
const searchCard = document.querySelector('.search-card')
const searchList = document.querySelector('.search-list')
const searchButton = document.querySelector('.search-btn')

const searchEventResponse = async () => {
    console.log(searchBar.value)

    try {
        const response = await axios.get('/search', { params: { name: searchBar.value } })
        if (response.data.length > 0 && searchBar.value !== "") {
            searchList.innerHTML = ''; // removing previous results 
            searchCard.classList.remove("d-none");
            for (product of response.data.slice(0, 9)) { // getting only first 9 elements 
                const newLi = document.createElement('li') // creating celements 
                const newAnchorTag = document.createElement('a')

                newAnchorTag.innerText = product.name;
                newAnchorTag.href = `/products/${product._id}`
                newAnchorTag.classList.add('search-anchor', 'text-reset')

                newLi.classList.add("list-group-item") // adding bootstrap class
                newLi.appendChild(newAnchorTag) // adding achore tag to li

                searchList.appendChild(newLi)



            }
        } else {
            if (!searchCard.classList.contains('d-none')) {
                searchCard.classList.add("d-none");

            }
        }



    } catch (e) {
        console.log(e)
    }
}


searchBar.addEventListener('input', searchEventResponse)

searchBar.addEventListener('input', () => {
    if (searchBar.value === '') {
        if (!searchCard.classList.contains('d-none')) {
            searchCard.classList.add("d-none");
        }
    }


})

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
})



