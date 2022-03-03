# Guest book Api
https://guest-book-api-ahmed.herokuapp.com

Database: mongodb



## End Points

### Get messages
GET  /api/messages
##### response
       {
      "messages": [
              {
                  "id": "",
                  "username": "",
                  "content": "",
                  "replies": [],
                  "creationDate": ,
                  "lastUpdateDate": null
              }
                ]
       }       
        
### Get message
GET  /api/messages/[id]
##### response
      {
          "message": {
              "id": "",
              "username": "",
              "content": "",
              "replies": [
                  {
                      "id": "",
                      "username": ",
                      "content": "",
                      "creationDate": 
                  }
              ],
              "creationDate": ,
              "lastUpdateDate": 
          }
      }


### Create message
POST  /api/messages
###### Bearer Token Authorization
      body {
          "username": "", "content": ""
      }

##### response
      {
          "newMessageId": ""
      }

### Update message
PUT  /api/messages/[id]
###### Bearer Token Authorization

      body {
          "username": "", "content": ""
      }

#### a reply to a message can be added:
PUT  /api/messages/[id]
###### Bearer Token Authorization

      body {
           "username": "",
           "content": "",
           "reply": {"username": "",
           "content": ""}
      }
##### response
       {
          "updatedMessageId": "621f16eece4f971d82799e28"
      }


### Delete message
DELETE /api/messages/[id]
###### Bearer Token Authorization

      body
      {
          "username": ""
      }
##### response
       {
          "deletedMessageId": ""
      } 


### Login
POST /api/login

      {
           "username": "",
           "email": "",
           "password": ""
       }
##### response
       {
       "userData": {
        "id": "",
        "username": "",
        "email": "",
        token
                     }
        }          
        
        

### Register
POST /api/register

      {
           "username": "",
           "email": "",
           "password": ""
       }
##### response
       {
       "userId": "621fc4e688a99a4484909b46"
       }           
       
