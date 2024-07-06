import { url } from "../helpers/index.js"

export let routes = [
    {
        name: 'home',
        path: 'src/test.html',
        beforeEnter: () => {
            console.log('df')
        }
    },
    {
        name: 'dash',
        path: 'dash.html',
        beforeEnter: () => {
            console.log('df')
        },
        children: [
            {
                name:'test',
                path:'src/test.html',
                afterEnter:()=>{
                    console.log(document.querySelector('.alert'))
                }
            }
        ]
    },
    {
        name: 'login',
        path: 'src/login.html',
        beforeEnter: () => {
            alert()
        }
    }
]