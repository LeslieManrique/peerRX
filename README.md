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

# PeerRX API
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


## /admin/listUsers
#### Type: get
#### Descriptions: lists users in the users table 
#### Restrictions: must be a registered admin 

## /admin/approve/:id
#### Type: post
#### Description: updates approve value in users table
#### Restrictions: registered, approved admin
#### URL parameters
```
id: id of user to approve 
```

## /agency/add
#### Type: post
#### Description: Registers a new agency user 
#### Restrictions: None 
#### Body parameters - all users
```
email_address 
password
user_type - {1 : 'agency', 2 : 'location'} 
```
#### Body parameters - agency specific
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

## /profile/agency/:userId
#### Description: Gets information about a user (must be of type agency) 
#### Restrictions: User must be logged in and userId must be there own or user must be a registered, approved, admin. 
#### URL Parameters
```
userId
```

## /agency/public/list 
#### Description can list of agencies and filter by optional query parameters. 
#### Restrictions: None 
#### Query parameters
```
state
zipcode
```

## /agency/delete/:userId
#### Description: delete an agency
#### Restrictions: registered, approved admin
#### URL parameters
```
userId - userId to delete 
```

## /location/add
#### Type: post
#### Description: Registers a new location user 
#### Restrictions: None 
#### Body parameters - all users
```
email_address 
password
user_type - {1 : 'agency', 2 : 'location'} 
```
#### Body parameters - location specific
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

## /profile/location/:userId
#### Description: Gets information about a user (must be of type location) 
#### Restrictions: User must be logged in and userId must be there own or user must be a registered, approved, admin. 
#### URL Parameters
```
userId
```

## /locations/public/list 
#### Description can  get list of locations and filter by optional query parameters. 
#### Restrictions: None 
#### Query parameters
```
state
zipcode
```

## /locations/delete/:userId
#### Description: delete an agency
#### Restrictions: registered, approved admin
#### URL parameters
```
userId - userId to delete 
```

## /peer/add/:userId
#### Type: Post
#### Description: create a peer that is associated with current authenticated agency
#### Restrictions, authenticated agency, location, admin who can access the param 
#### URL Parameters
```userId```
#### Body Parameters
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

## /peer/list/:userId
#### Type: get
#### Description: list peers that are associated wit h `userId`
#### Restrictions, authenticated agency, location, admin who can access the param 
#### URL Parameters
```userId```

## /peer/update/:userId/:peerId
#### Type: Put
#### Description: update peer information 
#### Url Parameters
```
userId - user either a location or agency
peerId - peer attached to user
```
## /peer/delete/:userId/:peerId
#### Description: delete peer 

# Broadcast Tables
#### location_requests
#### Description: 
Table for logging location requests.  
Locations are able to request for peers to be sent to provide patient care.  
Each request gets its on unique identifier (`id`). 
Preference are set by the location that sent out the request. 

`times_requested` is the number of times requests gets broadcasted  
`expired_at` is the time set for request to expire   
`note` any information a peer might need to know regarding the request  
`completed` boolean indicating a request has been fulfilled 

```
CREATE TABLE `location_requests`(
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`location_id` BIGINT NOT NULL, 
	`request_type` BIGINT NOT NULL,
	`gender_preference` varchar(100),
	`language_preference` varchar(100),
	`case` varchar(100),
	`age_range` varchar(100),
	`updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  	`created_at` TIMESTAMP NOT NULL,
  	`note` VARCHAR(255) DEFAULT '',
  	`times_requested` INT NOT NULL DEFAULT 0,
 	`expired_at` TIMESTAMP DEFAULT NULL,
 	`completed` TINYINT DEFAULT 0,
  	PRIMARY KEY(id),
  	FOREIGN KEY(`location_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
)AUTO_INCREMENT=7000000;
```

#### peers_accepted
#### Description: 
While the request is not expired, meaning it hasnt hit a set expiration time, all peers that accept the request will be recorded in this table. 
```

CREATE TABLE `peers_accepted`(
	`request_id` BIGINT NOT NULL,
	`peer_id` BIGINT NOT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  	`accepted_at` TIMESTAMP NOT NULL,
  	 FOREIGN KEY(`request_id`) REFERENCES `location_requests`(`id`) ON DELETE CASCADE,
  	 FOREIGN KEY(`peer_id`) REFERENCES `peers`(`peer_id`) ON DELETE CASCADE
);

```

#### peers_deployed
#### Description: 
A background process will be be executed every minute (or maybe 5) for each request as indicated in the `location_request` table. This process will look for any incomplete requests (where completed column is set to 0) and if the expiration time is hit, it will run an algorithm (matching logic) that chooses the best peer for the request (using a ranking system). 
Once a peer is chosen for the request, this table will be filled accordanly with the id of the request, id of the peer that was chosen and the time of approval. 

```
CREATE TABLE `peer_deployed`(
	`request_id` BIGINT NOT NULL,
	`peer_id` BIGINT NOT NULL,
	`approved_at` TIMESTAMP NOT NULL,
	FOREIGN KEY(`request_id`) REFERENCES `location_requests`(`id`) ON DELETE CASCADE,
	FOREIGN KEY(`peer_id`) REFERENCES `peers`(`peer_id`) ON DELETE CASCADE

);
```
