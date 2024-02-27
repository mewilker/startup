TODO: link onenote notebook. Somehow. Maybe not since that's not allowed.

## Startup ideas:

baking/cooking game
manage a hotel/resturant/store/zoo/travel agency (tycoon)
makeup game
scrapbook inventory
recipe sharing app



wix wordpress to maintain

DON'T STORE PICTURES!


## Common commands:
ssh -i [key pair file] ubuntu@52.201.103.13

nano [file name]

sudo serivce [service name] restart

grep - regex search

top - view running processes, exit with q

df - disk space -h gives nice labels

less/more is kinda like cat

wc - word count

ps - view process, top dump

history, ping, tracert - trace network

dig - dns record

\> overwrite operator
\>> concate

ctrl r recall

## DNS:
a is address

text is a textfile, might be helpful to get your page out there(i. e. google)

SOA is start of authority, this is some DNS server somewhere 

## HTML:
Tree Structure
Tags are in <>

Attributes are specified in the start tag with tag="value"

tags are closed like this: </>
the type of tag you use is important for acessibilty 

the escape char is &

Vanilla html has to create a bunch of files

index.html is default entry way

## CSS:

### General
    p{
      color: green;
    }

"p" is a selector. Multiple selectors can be used with commas. IDs are selected with the # and classes are selected with the . In addition, you can select descenants of a certain element by ommiting the commas, children by using a '>' siblings with a '~' and adjacent siblins with a '+'. Attributes can be selected with '[]'

Pseudo selectors are things like mouse hovers, hyperlink visited states. This is delinated with a colon.

"color:green" is a rule, with color being a property and green being a value.

if a property has multiple values you separate with a space NOT A COMMA!!

To use with html you use something like
    <p style = "color:green">insert text here</p>

or you link a document by including the line
    <link rel = "stylesheet" href = "index.css">

There something called the box, which is sized going inwards: margin, border, padding, content. 

By default, height and width change the content size, but box-sizing can be used to change it to the boarder.

### Units

px - pixels

pt - points (1/72 of inch)

in - inches

cm - centimeters

% - percentage of parent element

em - A multiplier of m in parent font

rem - a multiplier of m in the root font

ex - a multiplier of the height of element's font

vw - viewport width

vh - viewport height

vmin - viewport minimum dimension

vmax - viewport maximum dimension

### Color formats:

keyword: rebeccapurple

RGB hex #FF red hex FF blue hex FF green hex FF alpha hex 

RGB function rgb(0, 255, 255, 1) rgbalpha from 0 to 255

hue saturation light hsl(0-255 red to red, 30%, 90%, 0.5)

### Flex
display: flex; puts children in flex

flex-direction 

align-items:

justify-content:

### Border
border-style:

border-size:

### Fonts
to use a font downloaded, use code like this:
>>@font-face {
  font-family: 'Alfa Slab One';
  src: url(AlfaSlabOne-Regular.ttf);
}

online fonts require an @import tag

font-family: order of fonts by priority

generic font families:
>serif
>sans-serif
>fixed - chars are all the same size
>symbol - wingdings or something

### Animations

    animation-name:insertnamehere;
    animation-duration: # of seconds;

    @keyframes insertnamehere{ 
      from{
        property:value;
      }

      50%{ /*halfway throught the animation*/
        property:value;
      }

      to{
        property:value;
      }  
    }

## Javascript
Simple code example:

    function testAll(input, tester) {
      for (let i=0; i<input.length; i++){
        if (tester(input[i]) === false){
          return false
        }
      }
  
      const result = true
      return result
    }

    let par = function (msg) {
      if (msg.length<=3){
        return true
      }
    return false
    }

    const result = testAll(["cat","rat", "bat"], par) ;

    console.log(result);

Send to JSON using JSON.stringify(obj)

Get back using JSON.parse(json)

# Domain name: makenna.click
