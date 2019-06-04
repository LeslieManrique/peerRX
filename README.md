## Production 
docker-compose -f docker-compose.prod.yml up

## Development
docker-compose up

## .env
Fill out the credentials and place file in the project root directory
```
MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_USER= 
MYSQL_PASSWORD=
MYSQL_DATABASE_TEST=
MYSQL_DATABASE_PROD=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_USER_RECEIVER=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

```


#PeerRX API
## /login
#### Type: Post
#### Description: logs in a user and returns jwt 
#### Restrictions: None
#### Body parameters
```
email_address
password

```

### Returns
```
res.status(401).send({"success":"false","message":"No email or password given."})

res.status(401).send({"success":false, "message":"Email has not been registered. Please register your account."});

res.status(401).send({"success":false, "message":"Incorrect Password"});

for testing - 
res.json({success: true, token: 'JWT ' + token});
```


##/admin/listUsers
####Type: get
####Descriptions: lists users in the users table 
####Restrictions: must be a registered admin 

## /admin/approve/:id
#### Type: post
#### Description: updates approve value in users table
#### Restrictions: registered, approved admin
#### URL parameters
```
id: id of user to approve 
```

##/agency/add
####Type: post
####Description: Registers a new agency user 
####Restrictions: None 
####Body parameters - all users
```
email_address 
password
user_type - {1 : 'agency', 2 : 'location'} 
```
####Body parameters - agency specific
```
name
phone_number
country
address1
address2
city
state
zipcode
main_contact_first_name
main_contact_last_name
main_contact_phone_number
main_contact_email_address

```

##/profile/agency/:userId
#### Description: Gets information about a user (must be of type agency) 
#### Restrictions: User must be logged in and userId must be there own or user must be a registered, approved, admin. 
#### URL Parameters
```
userId
```

##/agency/public/list 
#### Description can list of agencies and filter by optional query parameters. 
#### Restrictions: None 
#### Query parameters
```
state
zipcode
```

##/agency/delete/:userId
#### Description: delete an agency
#### Restrictions: registered, approved admin
#### URL parameters
```
userId - userId to delete 
```

##/location/add
####Type: post
####Description: Registers a new location user 
####Restrictions: None 
####Body parameters - all users
```
email_address 
password
user_type - {1 : 'agency', 2 : 'location'} 
```
####Body parameters - location specific
```
name
phone_number
country
address1
address2
city
state
zipcode
main_contact_first_name
main_contact_last_name
main_contact_phone_number
main_contact_email_address
on_site_peers - 0|1 
location_type 

```

##/profile/location/:userId
#### Description: Gets information about a user (must be of type location) 
#### Restrictions: User must be logged in and userId must be there own or user must be a registered, approved, admin. 
#### URL Parameters
```
userId
```

##/locations/public/list 
#### Description can  get list of locations and filter by optional query parameters. 
#### Restrictions: None 
#### Query parameters
```
state
zipcode
```

##/locations/delete/:userId
#### Description: delete an agency
#### Restrictions: registered, approved admin
#### URL parameters
```
userId - userId to delete 
```

##/peer/add/:userId
####Type: Post
####Description: create a peer that is associated with current authenticated agency
####Restrictions, authenticated agency, location, admin who can access the param 
####URL Parameters
```userId```
####Body Parameters
```
req.body.first_name
req.body.last_name
req.body.email_address
req.body.phone_number
req.body.address1
req.body.address2
req.body.city
req.body.state
req.body.zip
req.body.specialty
req.body.age_range_start
req.body.age_range_end
req.body.language
req.body.gender
req.body.certification
req.body.certification_expiration_date
req.body.licensure
req.body.training_1
req.body.training_2
req.body.training_3
req.body.supervisor_name
req.body.supervisor_phone_number,
```

##/peer/list/:userId
####Type: get
####Description: list peers that are associated wit h `userId`
####Restrictions, authenticated agency, location, admin who can access the param 
####URL Parameters
```userId```

##/peer/update/:userId/:peerId
####Type: Put
####Description: update peer information 
####Url Parameters
```
userId - user either a location or agency
peerId - peer attached to user
````
##/peer/delete/:userId/:peerId
####Description: delete peer 

