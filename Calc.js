var firstNum = 0;
        let secondNum = 0;
        let operand = 0;
        let operatorUsed = false;
        let opOnScreen = false;
        let calculated = false;


        function numButtonClick(num){
            if(opOnScreen){
                document.getElementById("textBox").innerHTML = "";
                opOnScreen = false;
            } else if(calculated){
                document.getElementById("textBox").innerHTML = "";
                firstNum = 0;
                calculated = false;
            }
            if(!operatorUsed){
                firstNum = document.getElementById("textBox").innerHTML + num;
            } else {
                secondNum = document.getElementById("textBox").innerHTML + num;
            }
            document.getElementById("textBox").innerHTML = document.getElementById("textBox").innerHTML + num;
        }

        function operatorClick(num, sign){
            if(operatorUsed){
                document.getElementById("textBox").innerHTML = "Syntax error";
                clearCalc();
            }
            operator = num;
            operatorUsed = true;
            opOnScreen = true;
            document.getElementById("textBox").innerHTML = sign;
        }

        function calculate(){
            first = parseInt(firstNum);
            second = parseInt(secondNum);
            if(operator == 0){
                document.getElementById("textBox").innerHTML = first + second;
            } else if(operator == 1){
                document.getElementById("textBox").innerHTML = first - second;
            } else if(operator == 2){
                document.getElementById("textBox").innerHTML = first / second;
            } else if(operator == 3){
                document.getElementById("textBox").innerHTML = first * second;
            } else if(operator == 4){
                document.getElementById("textBox").innerHTML = Math.sqrt(first);
            } else if(operator == 5){
                document.getElementById("textBox").innerHTML = first ** second;
            } else if(operator == 6){
                document.getElementById("textBox").innerHTML = first % second;
            }
            firstNum = document.getElementById("textBox").innerHTML;
            secondNum = 0;
            operand = 0;
            operatorUsed = false;
            opOnScreen = false;
            calculated = true;
            
        }

        function clearCalc(){
            firstNum = 0;
            secondNum = 0;
            operand = 0;
            operatorUsed = false;
            opOnScreen = false;
            calculated = false;
            document.getElementById("textBox").innerHTML = "";
        }


