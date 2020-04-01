const giftr = {

    personList: [],

    key: "myStorage",

    selectedPersonData: {},

    init: () => {
        giftr.getList()
        giftr.createPersonList()
        giftr.addListeners()
    },

    createPersonList: () => {
        let personList = document.getElementById("person-list")
        personList.innerHTML = ""

        let temp = document.getElementById('person-List-template')
        let content = temp.content

        giftr.personList.forEach(item => {
            let person = content.cloneNode(true)
            person.querySelector(".person-name").textContent = item.name
            person.querySelector(".person-date").textContent = item.date

            person.querySelector(".person-container").setAttribute("data-id", item.id)
            person.querySelector(".person-delete").setAttribute("data-id", item.id)

            person.querySelector(".person-container").addEventListener("click", giftr.selectPerson)
            person.querySelector(".person-delete").addEventListener("click", giftr.deletePerson)
           
            personList.append(person)
        })
    },

    createGiftList: () => {
        let giftList = document.getElementById("gift-list")
        giftList.innerHTML = ""

        let temp = document.getElementById('gift-List-template');
        let content = temp.content;

        giftr.selectedPersonData.giftList.forEach(item => {
            let gift = content.cloneNode(true)
            gift.querySelector(".gift-name").textContent = item.name
            gift.querySelector(".gift-price").textContent = item.price
            gift.querySelector(".gift-notes").textContent = item.notes

            gift.querySelector(".gift-delete").setAttribute("data-id", item.id)

            gift.querySelector(".gift-delete").addEventListener("click", giftr.deleteGift)

            giftList.append(gift)
        })
    },

    addListeners: () => {
        document.getElementById("add-btn").addEventListener("click", giftr.adding)
        document.getElementById("person-cancel").addEventListener("click", giftr.cancelPerson)
        document.getElementById("gift-cancel").addEventListener("click", giftr.cancelGift)
        document.getElementById("person-save").addEventListener("click", giftr.savePerson)
        document.getElementById("gift-save").addEventListener("click", giftr.saveGift)
        document.getElementById("home-btn").addEventListener("click", giftr.homeBtn)
    },

    adding: () => {
        if ( document.querySelector("header").getAttribute("data-state") == "person" ){
            document.getElementById("person-name-input").value = ""
            document.getElementById("person-date-input").value = ""
            document.getElementById("person-form").className = "show"
        } else {
            document.getElementById("gift-name-input").value = ""
            document.getElementById("gift-price-input").value = ""
            document.getElementById("gift-notes-input").value = ""
            document.getElementById("gift-list").className = "hide"
            document.getElementById("gift-form").className = "show"
        }

    },

    cancelPerson: (ev) => {
        ev.preventDefault()
        document.getElementById("person-form").className = "hide"
    },

    cancelGift: (ev) => {
        ev.preventDefault()
        document.getElementById("gift-list").className = "show"
        document.getElementById("gift-form").className = "hide"
    },
    
// ---   
    
    savePerson: (ev) => {
        ev.preventDefault()
        if( !document.getElementById("person-name-input").value
         || !document.getElementById("person-date-input").value ){
             alert("no input")
             return
        }

        let person = {
            id: Date.now(),
            name: document.getElementById("person-name-input").value,
            date: document.getElementById("person-date-input").value,
            giftList: []
        }

        giftr.personList.push(person)
        
        localStorage.setItem(giftr.key, JSON.stringify(giftr.personList))


        document.getElementById("person-form").className = "hide"

        giftr.createPersonList()

    },

    saveGift: (ev) => {
        ev.preventDefault()
        if( !document.getElementById("gift-name-input").value
         || !document.getElementById("gift-price-input").value ){
             alert("no input")
             return
        }

        let gift = {
            id: Date.now(),
            name: document.getElementById("gift-name-input").value,
            price: document.getElementById("gift-price-input").value,
            notes: document.getElementById("gift-notes-input").value
        }

        giftr.selectedPersonData.giftList.push(gift)

        localStorage.setItem(giftr.key, JSON.stringify(giftr.personList))

        document.getElementById("gift-form").className = "hide"
        
        giftr.createGiftList()

        document.getElementById("gift-list").className = "show"
        
    },

// ---

    getList: () => {
        if (localStorage.getItem(giftr.key)) {
            let str = localStorage.getItem(giftr.key);
            giftr.personList = JSON.parse(str);
        }
    },

    selectPerson: (ev) => {

        if ( ev.target.className == "delete-btn person-delete" ){
            return
        } 

        let selectedPersonId = ev.currentTarget.getAttribute("data-id")

        document.getElementById("person-list").className = "hide"
        document.getElementById("person-selected").className = "show"
        document.getElementById("gift-list").className = "show"

        let data = giftr.personList.find(item => item.id == selectedPersonId)

        giftr.selectedPersonData = data

        document.getElementById("birth-date-selected").textContent = data.date
        document.getElementById("person-name-selected").textContent = data.name

        document.getElementById("person-form").className = "hide"

        document.querySelector("header").setAttribute("data-state", "gift")

        giftr.createGiftList()
    },

    homeBtn: (ev) => {
        document.querySelector("header").setAttribute("data-state", "person")
        document.getElementById("gift-list").className = "hide"
        document.getElementById("gift-form").className = "hide"
        document.getElementById("person-selected").className = "hide"
        document.getElementById("person-list").className = "show"
    },

    deletePerson: (ev) => {
        let id = ev.currentTarget.getAttribute("data-id")
        giftr.personList = giftr.personList.filter(item => item.id != id)

        localStorage.setItem(giftr.key, JSON.stringify(giftr.personList))

        ev.currentTarget.parentElement.remove()
    },

    deleteGift: (ev => {
        let id = ev.currentTarget.getAttribute("data-id")
        giftr.selectedPersonData.giftList = giftr.selectedPersonData.giftList.filter(item => item.id != id)

        localStorage.setItem(giftr.key, JSON.stringify(giftr.personList))

        ev.currentTarget.parentElement.remove()
    })

    
}

document.addEventListener("DOMContentLoaded", giftr.init);