-- Add sponsor logo columns to schools table
alter table schools 
add column sponsor_logo_1 text,
add column sponsor_logo_2 text,
add column sponsor_logo_3 text;
