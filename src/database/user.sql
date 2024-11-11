INSERT INTO Usr ("name", email, "countryId", "currencyId", image_url) VALUES
('John', 'john_doe@example.com', 1, 1, ''), -- normal
('Jane', 'jane_doe@example.com', 2, 2, NULL), -- null image URL
('A', 'a@short.com', 3, 3, 'http://example.com/a.jpg'), -- very short name, simple email
('BobbyExtraLongNameTheThird', 'bob_brown_long@example.com', 4, 4, 'https://example.com/brown_4.jpg'), -- long name
('Charlie', 'charlie.johnson@longdomainnamecompanyexample.co.uk', 5, 5, ''), -- long email domain
('Diana P.', 'diana_p@example.com', 6, 6, 'https://images.com/diana'), -- name with a dot
('Edward', 'ed@example.com', 7, 7, NULL), -- very short email
('Fiona', 'fiona+newsletter@walker.com', 8, 8, 'https://example.com/fiona.jpg'), -- email with plus sign
('George', '', 9, 9, ''), -- empty email
('Hannah Davis', 'hannah_davis@example.com', 10, 10, 'https://images.com/hannah_davis.png'), -- full name
('Isabella', 'isabella.lee@subdomain.example.com', 11, 11, NULL), -- email with subdomain
('Jack123', 'jack_123@example.com', 12, 12, 'http://example.com/image/jack.jpg'), -- alphanumeric name
('Kate', 'katherine.james@example.com', 13, 13, ''), -- alternate name format
('Liam', 'longlonglonglonglonglonglonglongemail@example.com', 14, 14, 'https://example.com/liam.jpg'), -- long email
('Mia', 'mia_h@example.com', 15, 15, 'https://example.com/mia_hall.jpg'), -- normal
('Noah', 'noah@simple.co', 16, 16, NULL), -- short email domain
('Olivia', 'o_rodgers@example.com', 17, 17, 'http://example.com/images/olivia.jpg'), -- name with initial
('Paul', 'paul-white@example.com', 18, 18, ''), -- email with hyphen
('Quinn OConnor', 'q.oconnor@example.org', 19, 19, 'https://example.com/q_oconnor.jpg'), -- name with apostrophe
('Ryan', 'ryan.jones@example.com', 20, 20, NULL); -- normal
