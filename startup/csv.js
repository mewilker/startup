const GrandCanyon = 
`Upgrade,Type,Travel,Hospitality,Attraction,Price,ClickGain
Bus,travel,0,0,0,5,0.5
Hostel,hospitality,1,0,0,5,0.5
Train,travel,1,0,0,5,0.5
Bed and Breakfast,hospitality,1,1,0,25,1
Inn,hospitality,1,2,0,60,5
New York,location,2,3,0,1000,1000
Dining Experience,attraction,2,3,0,100,7
Motel,hospitality,2,3,1,300,12
Hotel,hospitality,2,4,1,1000,20
Tour Guide,attraction,2,3,1,1000,22
Plane,travel,2,4,1,5000,100
Resort,hospitality,2,5,1,50000,125
Jet,travel,3,5,2,55000,300
Exp,attraction,4,6,2,55000,500`;

const NewYork = 
`Upgrade,Type,Travel,Hospitality,Attraction,Price,ClickGain
Bus,travel,0,0,0,1000,10.5
Hostel,hospitality,0,0,0,1500,15
Train,travel,1,0,0,1600,30
Bed and Breakfast,hospitality,0,1,0,5000,100
Inn,hospitality,1,2,0,7000,111
Banff,location,1,3,0,70000,70000
Dining Experience,attraction,1,3,0,7000,115
Motel,hospitality,1,3,0,10000,120
Hotel,hospitality,2,4,0,20000,145
Cruise Ship,travel,2,3,1,12000,125
Tour Guide,attraction,3,3,1,8000,120
Plane,travel,3,4,1,20000,140
Resort,hospitality,3,5,1,80000,175
Jet,travel,4,5,2,70000,170
Exp,attraction,5,6,2,100000,200`;

const Banff = 
`Upgrade,Type,Travel,Hospitality,Attraction,Price,ClickGain
Bus,travel,0,0,0,80000,180
Hostel,hospitality,0,0,0,75000,170
Train,travel,1,0,0,85000,185
Bed and Breakfast,hospitality,0,1,0,135000,210
Inn,hospitality,0,2,0,200000,215
Cabo San Lucas,location,2,3,0,500000,500000
Dining Experience,attraction,2,3,0,200000,200
Motel,hospitality,2,3,1,300000,220
Hotel,hospitality,2,4,1,550000,225
Tour Guide,attraction,2,3,1,400000,245
Plane,travel,2,3,1,300000,200
Resort,hospitality,2,5,1,680000,240
Jet,travel,3,5,2,1000000,245
Exp,attraction,4,6,2,1200000,300`;

const Cabo = 
`Upgrade,Type,Travel,Hospitality,Attraction,Price,ClickGain
Bus,travel,0,0,0,2500000,240
Hostel,hospitality,0,0,0,2700000,268
Train,travel,1,0,0,2500000,242
Bed and Breakfast,hospitality,0,1,0,2800000,289
Inn,hospitality,0,2,0,3000000,314
Dining Experience,attraction,1,1,0,3500000,325
Motel,hospitality,0,3,0,3200000,341
Hotel,hospitality,0,4,0,3500000,365
Cruise Ship,travel,2,0,1,3700000,370
Tour Guide,attraction,1,1,1,5000000,400
Hawaii,location,3,5,2,10000000,10000000
Plane,travel,3,5,2,5700000,411
Resort,hospitality,3,5,2,6300000,431
Jet,travel,4,5,2,7800000,425
Exp,attraction,5,6,2,12500000,450`

const Hawaii = 
`Upgrade,Type,Travel,Hospitality,Attraction,Price,ClickGain
Plane,travel,0,0,0,10000000,451
Hostel,hospitality,1,0,0,12500000,455
Bed and Breakfast,hospitality,1,1,0,14300000,462
Inn,hospitality,1,2,0,16200000,473
Dining Experience,attraction,1,0,0,21000000,484
Cruise Ship,travel,1,3,1,20000000,497
 the British Vigin Isles,location,1,3,1,83200000,83200000
Motel,hospitality,1,3,1,24200000,500
Hotel,hospitality,2,4,1,30000000,513
Tour Guide,attraction,1,3,1,35400000,525
Resort,hospitality,1,5,1,41750000,527
Jet,travel,2,5,1,47280000,532
Exp,attraction,3,6,2,94890000,540`

module.exports = {GrandCanyon, NewYork, Banff, Cabo, Hawaii}