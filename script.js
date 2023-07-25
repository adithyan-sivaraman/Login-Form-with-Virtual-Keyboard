let keyboard = document.getElementById("keyboard")
const vkey = document.getElementById("vkey");
const form = document.getElementById("loginform");
let pwd = document.getElementById("pass")
const show = document.getElementById("show")
const register = document.getElementById("register")
const login = document.getElementById("login")
let regDiv = document.querySelector(".register")
let loginDiv = document.querySelector(".login")

function showElement(element){
    let text = element.textContent;
if(text=="Register"){
    regDiv.classList.toggle("none")
    loginDiv.classList.toggle("none")
    register.className="bg-gray-200 underline";
    login.className="";
}
else {

    regDiv.classList.toggle("none")
    loginDiv.classList.toggle("none")
    login.className="bg-gray-200 underline";
    register.className="";
}
}


vkey.addEventListener("click", (e) => {


  if (vkey.checked) {
    keyboard.className = "flex"
    pwd.readOnly = true;
    pwd.value = ""
  }
  else {
    keyboard.className = "none"
    pwd.readOnly = false;;
  }
})

function validatePwd(pwd) {
    
    const minlen = pwd.length > 7;
    const small = /[a-z]/.test(pwd);
    const caps = /[A-Z]/.test(pwd);
    const number = /[0-9]/.test(pwd);
    const special = /[!@#$&*]/.test(pwd)
    const special1 = /^[!@#$&*]+$/.test(pwd)
    
    if (!(minlen && small && caps && number&&special)) {
      return false;
    }
    else if(special1==true){
      return false;
    }
  else{
    return true;
  }
    
  }


const forgot = document.querySelector("p");
forgot.addEventListener("click", () => {
  let formData = []
  const email = document.getElementById("email").value;
  if (!email) {
    showDialog("please enter email","warning")
  }
  else {
    // let newPwd = prompt("enter a new password");
    let dialog = document.createElement("dialog");
    dialog.style.justifyContent = "start"
    dialog.style.alignItems="flex-start"
    dialog.innerHTML=`
    <p>Enter New Password</p>
    <input type="password" id="newPwd" style="margin-top:10px;margin-left:10px;"/>
    <span style="color:white">Enter a valid password</span>
    <p>Password must contain</p>
    <span>1 Capital Letter</span>
    <span>1 Small Letter</span>
    <span>1 Special Character ( ! , @ , # , $ , & , * )</span>
    <span>1 Number</span>
    <span>8 Characters</span>
    <button type="button" id="dialogBtn" class="button">Update</button>
    `
    
    document.body.append(dialog)
    dialog.show()
    let dialogBtn = document.getElementById("dialogBtn")
    
    dialogBtn.addEventListener("click",()=>{
        
        let newPwd = document.getElementById("newPwd");
        
        let validation = validatePwd(newPwd.value)
        if (validation==false||newPwd.value.length===0) {
            let span = newPwd.nextElementSibling;
            span.setAttribute("style","font-size:14px;color:red;")
            span.textContent = "Please enter a valid password"
          }
          else {
            dialog.remove()
            formData.push("forgot")
            formData.push(email)
            formData.push(newPwd.value)
            fetch('http://localhost:3000/login', {
              method: 'POST',
              body: JSON.stringify(formData),
              headers: {
                "Content-type": "application/json"
              }
            }).then(response => response.text()).then(data => {
              
      
              if (data == "valid credentials") {
                  
                input.forEach(input => {
                  input.value = ""
                  showDialog(data,"info")
                })
                
              }
              else {
                  showDialog(data,"warning")  
              }
      
            }).catch(error => {
              console.log(error)
            })
          }
    })

    

  }
})

form.addEventListener("submit", (e) => {
  let formData = []
  e.preventDefault();

  formData.push("login")
  let input = document.querySelectorAll("input")
  input.forEach((input) => {
    formData.push(input.value)
  })


  fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json"
    }
  }).then(response => response.text()).then(data => {
    

    if (data == "valid credentials") {
      input.forEach(input => {
        input.value = ""
      })
      showDialog(data,"info")
    }
    else {
        showDialog(data,"warning")
    }

  }).catch(error => {
    console.log(error)
  })
})


show.addEventListener("click", () => {
  if (pwd.type == "password") {
    pwd.type = "text"
  }
  else {
    pwd.type = "password"
  }
})



const chars = ['!', '@', '#', '$', '&', '*', 'backspace', "clear",
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm']

const actionKeys = ["backspace", "shift", "caps", "clear"]
const div = document.createElement("div")
chars.forEach((char, index) => {

  const button = document.createElement("button");
  button.type = "button"

  button.textContent = char;


  if (actionKeys.indexOf(char) === -1) {
    button.className = "alphabet"
  }
  if (char == "backspace" || char == "clear") {
    button.setAttribute("style", "width:80px !important;margin-top:10px")
  }

  else {
    button.id = char;
    button.setAttribute("style", "margin-top:10px")
  }

  div.append(button)

})
keyboard.append(div)




keyboard.addEventListener("click", (e) => {
  if (e.target.id == "caps") {
    let smBtn = document.querySelectorAll(".alphabet");
    smBtn.forEach((btn) => {
      let text = btn.textContent;
      if (!btn.classList.contains("large")) {
        btn.textContent = text.toUpperCase()
        btn.classList.add("large")
      }
      else {
        btn.textContent = text.toLowerCase()
        btn.classList.remove("large")
      }
    })

  }

  if (e.target.id === "clear") {
    pass.value = ""
  }

  if (e.target.id === "backspace") {
    let length = pass.value.length;
    pass.value = pass.value.slice(0, length - 1);
  }

  if (!e.target.id) {
    pass.value += e.target.textContent;
  }

})



//Registration Form

let password = document.getElementById("password")
let minlen = document.getElementById("minlen")
let caps = document.getElementById("caps")
let small = document.getElementById("small")
let number = document.getElementById("number")
let spl = document.getElementById("spl")

password.addEventListener("input",()=>{
    let pwd = password.value;
    
    if(pwd.length>7){
        minlen.className ="validated"
        minlen.innerHTML = "&#10003;"
    }
    else {
        minlen.className ="validate"
        minlen.innerHTML = "&#88;"
    }

    if(/[a-z]/.test(pwd)){
        small.className ="validated"
        small.innerHTML = "&#10003;"
    }
    else {
        small.className ="validate"
        small.innerHTML = "&#88;"
    }
    if(/[A-Z]/.test(pwd)){
        caps.className ="validated"
        caps.innerHTML = "&#10003;"
    }
    else {
        caps.className ="validate"
        caps.innerHTML = "&#88;"
    }
    if(/[0-9]/.test(pwd)){
        number.className ="validated"
        number.innerHTML = "&#10003;"
    }
    else {
        number.className ="validate"
        number.innerHTML = "&#88;"
    }

    if(/[!@#$&*]/.test(pwd)){
        spl.className ="validated"
        spl.innerHTML = "&#10003;"
    }
    else {
        spl.className ="validate"
        spl.innerHTML = "&#88;"
    }

    

})


const regForm = document.getElementById("regform");
let regPwd = document.getElementById("password")
regForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    
    let validated = validatePwd(regPwd.value)
    
    if(validated===false){
        showDialog("Please enter a valid password","warning")
    }

    else {
        let email  = document.getElementById("emailid").value
        let password = document.getElementById("password").value
        let formData = [email,password]
        fetch("http://localhost:3000/register",{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{
                "Content-type":"application/json"
            }
        }).then(response=>response.text()).then(data=>{
            const text = data==="user created" ? "User created successfully" : "User exists already. Kindly Login";
          
                showDialog(text,"success",(e)=>{
                    showElement(e)
                })
            
        })
    }
})

function showDialog(text,action,callback){
    let dialog = document.querySelector("dialog");
    let dText = document.getElementById("text");
    dText.textContent = text;
    dialog.classList.remove("none")
    setTimeout(()=>{
        dialog.classList.add("none")
        if(action=="success"){
            callback("Login")
        }        
},2000)

}


const showPwd = document.getElementById("showPwd")
showPwd.addEventListener("click", () => {
    if (regPwd.type == "password") {
        regPwd.type = "text"
    }
    else {
        regPwd.type = "password"
    }
  })
