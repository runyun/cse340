-- 1. Insert the new record 
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify the Tony Stark record to change the account_type to "Admin"
UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- 3. Delete the Tony Stark record from the database.
DELETE FROM account WHERE account_id = 1;

-- 4. Modify the "GM Hummer" record
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_id = 10;

-- 5. Inner join
SELECT inv_make, inv_model, classification_name 
FROM inventory AS a 
INNER JOIN classification AS c ON a.classification_id = c.classification_id 
WHERE c.classification_id = 2;

-- 6. Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory 
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');  