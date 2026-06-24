import {test,expect} from '@playwright/test'

let access_Token:any //global variable created for access_token, instance_url, token_type, id
let instance_Url:any
let token_Type:any
let sys_id:any


test("Generate the token",async({request})=>{ //generating the token
    let token=await request.post("https://login.salesforce.com/services/oauth2/token",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Connection":"keep-alive"
        },
        form:{
            "grant_type":"password",
            "client_id":"",
            "client_secret":"",
            "username":"",
            "password":"",
        }
    }
)
let generateRes=await token.json()
console.log(generateRes)
access_Token=generateRes.access_token
instance_Url=generateRes.instance_url
token_Type=generateRes.token_type

console.log(access_Token)
console.log(instance_Url)
})

test("Create Lead",async({request})=>{ //create lead
    let createLead=await request.post(`${instance_Url}/services/data/v64.0/sobjects/Lead/`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${token_Type} ${access_Token}`
        },
        data:{
            "FirstName": "Raks",
            "LastName": "v",
            "Salutation": "Mrs.",
            "Company": "Test",
            "Status": "Working - Contacted"
        }
    })
let successRes=await createLead.json()
console.log(successRes)
sys_id= successRes.id
console.log(sys_id)
expect(createLead.status()).toBe(201)
})

test("Get the Lead details",async({request})=>{ //fetching the lead details
    let getLead=await request.get(`${instance_Url}/services/data/v64.0/sobjects/Lead/${sys_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${token_Type} ${access_Token}`
        }
    })
let getLeadRes=await getLead.json()
console.log(getLeadRes)
expect(getLead.status()).toBe(200)
})

test("Update the first name using Patch",async({request})=>{ //updating lead's firstname using patch method
    let updateName=await request.patch(`${instance_Url}/services/data/v64.0/sobjects/Lead/${sys_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${token_Type} ${access_Token}`
        },
        data:{
            "FirstName": "Raks updated"
        }
    })
expect(updateName.status()).toBe(204)
})

test("Delete the lead",async({request})=>{ //delete the lead
    let deleteLead=await request.delete(`${instance_Url}/services/data/v64.0/sobjects/Lead/${sys_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${token_Type} ${access_Token}`
        }

    })
expect(deleteLead.status()).toBe(204)
})