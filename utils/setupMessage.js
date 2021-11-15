const chalk = require('chalk');

const logo = `

AAA   bb      lll        
AAAAA  bb      lll   eee  
AA   AA bbbbbb  lll ee   e 
AAAAAAA bb   bb lll eeeee  
AA   AA bbbbbb  lll  eeeee 
                          
`

const ab = chalk.hex('#e81202')(`

█████╗     ██╗██████╗ 
██╔══██╗   ██╔╝██╔══██╗
███████║  ██╔╝ ██████╔╝`)
+chalk.hex('#031cfc')(`
██╔══██║ ██╔╝  ██╔══██╗
██║  ██║██╔╝   ██████╔╝
╚═╝  ╚═╝╚═╝    ╚═════╝ 
                       

`)

const A = `                                
AAA               
A:::A              
A:::::A             
A:::::::A            
A:::::::::A           
A:::::A:::::A          
A:::::A A:::::A         
A:::::A   A:::::A        
A:::::A     A:::::A       
A:::::AAAAAAAAA:::::A      
A:::::::::::::::::::::A     
A:::::AAAAAAAAAAAAA:::::A    
A:::::A             A:::::A   
A:::::A               A:::::A  
A:::::A                 A:::::A 
AAAAAAA                   AAAAAAA
`

const a = chalk.hex('#e81202')`

█████  
██   ██ 
███████ 
██   ██ 
██   ██ 
        
`

function setupMessage() {
  console.log(ab);
  console.log(chalk.bold('Configuring ') + chalk.hex('#e81202').bold('A') + chalk.hex('#031cfc').bold('B') + chalk.bold('le A/B test!'))
}

module.exports = setupMessage;