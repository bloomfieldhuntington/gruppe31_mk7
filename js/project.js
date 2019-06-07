//var currentUserCookie = getCookie("currentUser").split("[?]");
//var currentUser =  {name: currentUserCookie[0], firstName: currentUserCookie[1], lastName: currentUserCookie[2], password: currentUserCookie[3]}
//Current User

    var currentUserCookie = getCookie("currentUser").split("[?]");
    var currentUserObj = {elementId: currentUserCookie[0], firstName: currentUserCookie[1], lastName: currentUserCookie[2], password: currentUserCookie[3]}
    
    var cardCounter = 0;
    var zoneCounter = 3;
    var projectMemberCounter = 1;
    var user = currentUserCookie[0];
    //dropZones array
    const dropZones = [
        {name: "todo", elementId: "zone0"},
        {name: "doing", elementId: "zone1"},
        {name: "done", elementId: "zone2"}
       
    ];
    //card[] array med alle card objektene
    const cards = [];
    //et array som skal lagre alt som blir skrevet ut i activityLoggen
    const activityLogEntries = [];
    
    var projectmembers = JSON.parse(localStorage.getItem("usersArray"))/*[{firstName: "Fredrik", lastName: "Holanger", elementId: "user1"},
                            {firstName: "Kredrik", lastName: "Polanger", elementId: "user2"},
                            {firstName: "Fredrik", lastName: "Holanger", elementId: "user3"},
                            {firstName: "Fredrik", lastName: "Holanger", elementId: "user4"}
                           ];*/
    
    //Removes the object of the current user from projectmembers before putting it back at the start of the array
    let indexToDelete = projectmembers.indexOf(projectmembers.find(o => o.name == currentUserObj.name));
    projectmembers.splice(indexToDelete, 1);
    projectmembers.unshift(currentUserObj);

    for(let i=0;i<projectmembers.length;i++){
        projectmembers[i].elementId = "user"+(i+1);
    }

    //Addcard button Element
    var addCardBtn = document.getElementById("addCard");
    //addRow Button Element
    var addZoneBtn = document.getElementById("addRow");
    
    //Elementet til knappen man kan dra kort til, for å slette.
    var cardDisposal = document.getElementById("cardDisposal");

    var ActivityEl = document.getElementById("activityContainer");
    
    //Container Element der alle Drop Sonene skal opprettes.
    const mainEl = document.getElementById("main");
    
    //body element
    var bodyEl = document.getElementsByTagName("BODY")[0];
       
    //looper gjennom alle variablene i dropzones og kjører addDropZonesToDOM for hver av dem.
    dropZones.forEach(addDropZonesToDOM);
          
    //kjøer addCardsToDOM for hvert card objekt i Cards[].
    cards.forEach(addCardsToDOM);

    // tar inn handling som sier hva som har blitt gjort og item1 og 2 ettersom hvilke elementer som har vært involvert.
    function PrintOutActivityLog(handling, item1, item2){
      
        let activityText ="";
       
        switch(handling){
            case "cardMoved": activityText = " flyttet " + item1 + " til " + item2;
                
                break;
                
            case "cardAdded": activityText = " Opprettet kortet " + item1;
       
                break;
                
            case "zoneAdded": activityText = " Opprettet kolonnen " + item1;
                   
                break;
                
            case "cardRemoved": activityText = " Slettet kortet " + item1;
                break;
                
            case "zoneRemoved": activityText = " Slettet kolonnen " + item1;
                break;
                
            case "edited": activityText = " Endret navn på " + item1 + " til " + item2;
            }
        
         activityLogEntries.push({
            logEntry: activityText,
            logDate: getCurrentTimeString("str"),
            name: user
            
        });
       renderActivityLogFromArray(activityLogEntries[activityLogEntries.length-1])
            
        }

    function getCurrentTimeString(format){
         let currentTime = new Date();
        
        
       if(format == "str"){
          
        let date = currentTime.getFullYear() + "-" + (currentTime.getMonth()+1) + "-" +currentTime.getDate();
        let time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
        let dateTime = date + " " +  time;
         
        return dateTime; 
            
        }else if(format == "utc"){
                 
        return currentTime.toUTCString()
        }
    }

    function getTomorrowTimeString(){
        let currentTime = new Date(); 
        let tomorrow = new Date();
        
        tomorrow.setFullYear(currentTime.getFullYear());
        tomorrow.setMonth(currentTime.getMonth());
        tomorrow.setDate(currentTime.getDate()+2);
        tomorrow.setHours(-22,0,0); 
        
        return tomorrow.toUTCString();
        
        
        }
    
    
    //tar inn et objekt fra activityLogEntries og rendrer det ut i ActivityLoggen på siden.  
    function renderActivityLogFromArray(entry){
        
        let createLogEntryContainer = document.createElement("DIV");
        let createLogEntryUser = document.createElement("H3");
        let createLogEntry = document.createElement("P");
        let createLogDate = document.createElement("p");
        
        createLogEntryContainer.className ="cm-text-light cm-card-2 cm-shadow-c";
        createLogEntryUser.className ="cm-text-p1";
        createLogEntry.className ="cm-text-p1";
        createLogDate.className ="activity-time cm-text-p1";
        
        createLogEntryUser.innerText = entry.name;
        createLogEntry.innerText = entry.logEntry;
        createLogDate.innerText = entry.logDate;
        
        ActivityEl.appendChild(createLogEntryContainer);
        createLogEntryContainer.appendChild(createLogEntryUser);
        createLogEntryContainer.appendChild(createLogEntry);
        createLogEntryContainer.appendChild(createLogDate);
        
         
        /*
        <div class="cm-text-light cm-card-2 cm-shadow-c">
                    <h3 class="cm-text-p1">Name</h3>
                    <p class="cm-text-p1">Did this</p>
                    <p class="activity-time cm-text-p1">2019-30-14</p>
                </div>
        */
    }

    //func som kjører når man trykker på CardEdit
    function onCardClick(event){
        let targetCard = event.currentTarget.parentNode.parentNode;
        let targetCardObj = getCardObjectById(targetCard.id);
        updateCard(targetCardObj, false);
        
    }
    
    //
    function onZoneClick(event){
        targetZone = event.currentTarget.parentNode.parentNode;
        console.log(targetZone);
        updateDropZone(getZoneObjectById(targetZone.id), false)
    }

    //kjøres når man redigerer på et kort
    function updateCard(cardObj, isNewCard){
        let cardEl = document.getElementById(cardObj.elementId);
        
        let DeadLineInput = document.createElement("INPUT");
        let backgroundBlocker = document.createElement("DIV");
        let editCardsWindow = document.createElement("DIV");
        let buttonElement = document.createElement("button");
        let cardEditHeader = document.createElement("H2");
        let cardEditDes = document.createElement("DIV");
        let cardEditDesText = document.createElement("P");
        let userDiv = document.createElement("DIV");
        let cardMembersDiv = document.createElement("DIV");
        
        
        DeadLineInput.type = "date";
        DeadLineInput.id = "EditDeadLine";
        DeadLineInput.value = cardObj.deadLine;
            
        cardEditDes.id = "des";
        cardEditDesText.id ="des-text";
        backgroundBlocker.id = "backgroundBlocker";
        editCardsWindow.id ="editCardWindow";
        buttonElement.id = "cardEditBtn";
        cardEditHeader.id ="card-Name";
        cardEditHeader.className ="edit-Name";
        userDiv.id = "userDiv";
        cardMembersDiv.id = "cardMembersEdit"
        
        buttonElement.innerText = "Save";
        cardEditHeader.innerText = getCardObjectById(cardEl.id).name; 
        cardEditHeader.contentEditable = true;
        cardEditDesText.innerText = getCardObjectById(cardEl.id).description;
        cardEditDesText.contentEditable = true;
        
        
        console.log(cardEditDesText.innerText);
        bodyEl.appendChild(backgroundBlocker);
        bodyEl.appendChild(editCardsWindow);
        editCardsWindow.appendChild(cardEditHeader);
        editCardsWindow.appendChild(cardEditDes);
        cardEditDes.appendChild(cardEditDesText);
        editCardsWindow.appendChild(buttonElement);
        editCardsWindow.appendChild(userDiv);
        editCardsWindow.appendChild(cardMembersDiv);
        editCardsWindow.appendChild(DeadLineInput);
        
        for(var i = 0; i < projectmembers.length; i++){
            let userIcon = createUserIcon(projectmembers[i]);
            
            if(cardObj.userIcons.includes(projectmembers[i].elementId)){
                
                cardMembersDiv.appendChild(userIcon);
            }else{
                userDiv.appendChild(userIcon);
                
            }
            
            
            userIcon.addEventListener("click", function(event){
                currentIcon = event.currentTarget;
                if(userIcon.parentNode.id == "userDiv"){
        
                cardMembersDiv.appendChild(currentIcon);
                    
                }else if(userIcon.parentNode.id == "cardMembersEdit"){
                    userDiv.appendChild(currentIcon);
                }
                
            });
            
            
        }
        /*
        <div id="editCardWindow">
            <h2 class="edit-Name" id="card-Name">Card Name</h2>
            <div id="des"><p id="des-text">Card Des</p></div>
            <button id="cardEditBtn">Save</button>
            
            <div id="userDiv">
                <div id="user1" class="users"><h3 class="textUser"></h3></div>
                <div id="user2" class="users"><h3 class="textUser"></h3></div>
                <div id="user3" class="users"><h3 class="textUser"></h3></div>
            </div>
      <input id="EditDeadLine" type="date" name="dLine">
        </div>
        */
           
        
        buttonElement.addEventListener("click", function(){
            
            let nameBeforeEdit = getCardObjectById(cardEl.id).name; //name before Edit
            let cardNameEl = cardEl.querySelector(".card-title");
            let desTextEl = cardEl.querySelector(".card-content");
            let addedCardMembers = cardMembersDiv.querySelectorAll(".users");
            let allMembers = userDiv.querySelectorAll(".users");
            let cardMemberAreaEl = cardEl.querySelector("#c-m");
            let deadLineEl = cardEl.querySelector("#deadLineDiv");
            let deadLineTextEl = deadLineEl.querySelector("#deadLineDivText");
            
            let deadLineTime = Date.parse(convertDateInputToDate(DeadLineInput.value));
            let currenTime = Date.parse(getCurrentTimeString("utc"));
             
            if(deadLineTime > currenTime){
                deadLineEl.style.backgroundColor = "green";
                
            }else{
                deadLineEl.style.backgroundColor = "red";
            }
            cardObj.deadLine = DeadLineInput.value;
            deadLineTextEl.innerText = cardObj.deadLine;
           
            
            
            addedCardMembers.forEach(function(icon){
                
                if(!(cardObj.userIcons.includes(icon.id))){
                cardObj.userIcons.push(icon.id);
                let createPersonBadge = document.createElement("DIV");
                createPersonBadge.className = "person";
                createPersonBadge.id = icon.id;
                createPersonBadge.innerText = icon.innerText;
                cardMemberAreaEl.appendChild(createPersonBadge);
                   
                    
                }
            });
             allMembers.forEach(function(icon){
                 if(cardObj.userIcons.includes(icon.id)){
                     iconCssId = "#" + icon.id;
                     cardObj.userIcons.splice(cardObj.userIcons.indexOf(icon.id), 1);
                     currentIcon = cardMemberAreaEl.querySelector(iconCssId);
                        console.log("yoyoy: " + currentIcon.id)
                     currentIcon.parentNode.removeChild(currentIcon);
                 }
             });
            
            
            //oppdaterer kortet sitt object med Endringene som har blitt gjort
            getCardObjectById(cardEl.id).name = cardEditHeader.innerText;
            getCardObjectById(cardEl.id).description = cardEditDesText.innerText;
            
            //oppdaterer kortet på siden med de nye endringene
            cardNameEl.innerText = cardObj.name;
            desTextEl.innerText = cardObj.description;
            
            editCardsWindow.parentNode.removeChild(editCardsWindow);
            backgroundBlocker.parentNode.removeChild(backgroundBlocker);
            
            //sjekker om dette kortet akkurat ble opprettet
            if(isNewCard){
                PrintOutActivityLog("cardAdded", cardObj.name);
               //sjekker om card name har blitt endret på
            }else if(nameBeforeEdit != cardObj.name){
                   PrintOutActivityLog("edited", nameBeforeEdit, cardObj.name)
               }
                
                });
          
         
    }
    
    //tar inn et bruker objekt og Lager et user Icon og returnerer dom elementet
    function createUserIcon(userObj){
        let userIconDiv = document.createElement("DIV");
        let hoverMember = document.createElement("SPAN");
        let userIconText = document.createElement("H3");
        let userInitials = (userObj.firstName.charAt(0) + userObj.lastName.charAt(0)).toLocaleUpperCase();
        
        
        hoverMember.className = "userHover";
        hoverMember.innerText = userObj.firstName + " " + userObj.lastName;
        userIconDiv.style.background = "gold";
        userIconDiv.id = userObj.elementId;
        userIconDiv.className = "users";
        userIconText.className = "textUsers";
        userIconText.innerText = userInitials;
        
        userIconDiv.appendChild(hoverMember);
        userIconDiv.appendChild(userIconText);
        
        
        return userIconDiv;
        /*
        
            <div id="userDiv">
                <div id="user1" class="users"><h3 class="textUser"></h3></div>
                <div id="user2" class="users"><h3 class="textUser"></h3></div>
                <div id="user3" class="users"><h3 class="textUser"></h3></div>
            </div>
        
        */
    }

    
    
    function convertDateInputToDate(dateInputStr){
        let date = new Date();
        let dateArr = dateInputStr.split("-");
        console.log(dateArr);
        date.setFullYear(parseInt(dateArr[0]));
        date.setMonth((parseInt(dateArr[1])-1));
        date.setDate((parseInt(dateArr[2])+1));
        date.setHours(-22,0,0);
        
        
        return date.toUTCString();
        
    }
    //kjøres når man redigerer på en zone/kolonne. tar inn objekte som skal endres og en bool som sier om kortet man redigerer er et kort som akkurat har blitt opprettet
    function updateDropZone(zoneObj, isNewZone){
        
        let backgroundBlocker = document.createElement("DIV"); 
        let editZoneWindow = document.createElement("DIV");
        let editZoneHeader = document.createElement("H2");
        let editZoneBtn = document.createElement("BUTTON");
        let deleteZoneBtn = document.createElement("BUTTON");
        
        backgroundBlocker.id = "backgroundBlocker";
        editZoneWindow.id = "editZoneWindow";
        editZoneHeader.id= "zone-Name";
        editZoneHeader.className = "edit-Name";
        editZoneBtn.id = "zoneEditBtn";
        deleteZoneBtn.id = "delete-Zone-btn";
        editZoneHeader.contentEditable = true;
        editZoneBtn.innerText = "Save";
        editZoneHeader.innerText = zoneObj.name;
        deleteZoneBtn.innerText ="Delete Column";
        
        bodyEl.appendChild(backgroundBlocker);
        bodyEl.appendChild(editZoneWindow);
        editZoneWindow.appendChild(editZoneHeader);
        editZoneWindow.appendChild(editZoneBtn);
        editZoneWindow.appendChild(deleteZoneBtn);
        
        
        
        
        
        
        editZoneBtn.addEventListener("click", function(){
            let nameBeforeEdit = zoneObj.name;
            let zoneElement = document.getElementById(zoneObj.elementId);
            let zoneNameEl = zoneElement.querySelector(".column-header-text");
            
            zoneObj.name = editZoneHeader.innerText;
            zoneNameEl.innerText = editZoneHeader.innerText;
            
            if(isNewZone){
                PrintOutActivityLog("zoneAdded", zoneObj.name);
               }else{
                   PrintOutActivityLog("edited", nameBeforeEdit, zoneObj.name)
               }
            editZoneWindow.parentNode.removeChild(editZoneWindow);
            backgroundBlocker.parentNode.removeChild(backgroundBlocker);
            
        });
        
        deleteZoneBtn.addEventListener("click", function(){
            deleteZone(zoneObj.elementId);
            editZoneWindow.parentNode.removeChild(editZoneWindow);
            backgroundBlocker.parentNode.removeChild(backgroundBlocker);
        });
        
        /* <div id="editZoneWindow">
        <h2 id="">ZoneName</h2>
        <button id="zoneEditBtn">Save</button>
    </div>
    */
    }
    
    //Pusher en ny dropZone inn i arrayet DropZones[] og legger det up på siden.
    function AddZone(){
        
        console.log("click Zone");
        var newZone = {name: "NewZone", elementId: "zone" + zoneCounter.toString()};
        zoneCounter++;
        dropZones.push(newZone);
        addDropZonesToDOM(dropZones[dropZones.length-1]);
        updateDropZone(dropZones[dropZones.length-1], true);
        updatePercentDone();
        if(getCookie("darkmode") == "1"){
            styleClassBackgroundColor(columnHeaderClass, "#3a3a3a");
        } 
        
        
    }
    
    //Pusher et nytt kort inn i arrayet Cards[] og legger det up på siden.
    function AddCard(){
        
        console.log("AddCard click");
        
        var newCard = {
    
                name: "New Card",
                description: "Card Content",
                status: dropZones[0].elementId,
                userIcons: [],
                deadLine: "",
                elementId: "card" + cardCounter
        };
          
        
        cards.push(newCard);
        addCardsToDOM(cards[cards.length-1]);
        updateCard(cards[cards.length-1], true);
        
        cardCounter++;
        
        if(getCookie("darkmode") == "1"){
            styleClassBackgroundColor(cardsClass, "#3a3a3a");
        } 
        updatePercentDone();
    }   
    
    //drag start func, som kjøres når man starter å dra
    function dragstart_handler(event) {
     
        console.log("DRAG");
        console.log("TASK", event.target.id);
        event.dataTransfer.setData("text/plain", event.target.id);
        console.log("dragStart: " + event.target.id);
        changeZIndex(event.target.id, "-1"); 
              
    } 
            
    //dragOver start func, som kjøres når man holder det over et som er "dropable"
    function dragover_handler(event) {
        console.log("dragover: " + event.target.id);
        event.preventDefault();
        
    }
    
    //dropHandler, som kjøres når man dropper
    function drop_handler(event) {
        let data = event.dataTransfer.getData("text/plain");
        let card = getCardObjectById(data);  
        event.preventDefault();
            
        //sjekker at det man drar er i cards
        if(cards.includes(card)){
           
            //sjekker at dropsonen er i arryet dropZones[] og at kortet ikke ble droppet i den sonen den allerede var i
        if(dropZones.includes(getZoneObjectById(event.target.id))&&(card.status !== event.target.id)) {
            let el = document.getElementById(data);
            event.target.appendChild(el);
            card.status = event.target.id;
            updatePercentDone();
            PrintOutActivityLog("cardMoved", getCardObjectById(data).name, getZoneObjectById(event.target.id).name);
        }

       }
            changeZIndex(data, "10");
    }
    
    //Update DropContainer/render cards from Array
    function addDropZonesToDOM(dropper) {
        let createColumn = document.createElement("SECTION");
        let createColumnHeader = document.createElement("DIV");
        let createColumnHeaderText = document.createElement("H1");
        let createColumnHeaderBtn = document.createElement("BUTTON");
        let createColumnHeaderBtnIcon = document.createElement("icon"); // Benjamin
        
        createColumn.className = "column";
        createColumnHeader.className = "column-header";
        createColumnHeaderText.className ="column-header-text";
        createColumnHeaderBtn.className = "column-header-btn";
        createColumnHeaderBtnIcon.className = "fas fa-bars"; // klasse fra FontAwesome.com
        
        createColumnHeaderText.innerText = dropper.name;
        
        mainEl.appendChild(createColumn);
        createColumn.appendChild(createColumnHeader);
        createColumnHeader.appendChild(createColumnHeaderText);
        createColumnHeader.appendChild(createColumnHeaderBtn);
        createColumnHeaderBtn.appendChild(createColumnHeaderBtnIcon); // Benjamin
        
        createColumn.id = dropper.elementId;
        
        createColumn.ondragover = dragover_handler;
        createColumn.ondrop = drop_handler;
        createColumn.ondragleave = ondragLeave_handler;
        createColumnHeaderBtn.onclick = onZoneClick;
    }
    
    //render cards from Array, Tar inn et objekt fra cards og lager et kort på siden.
    function addCardsToDOM(card){
        //opretter alle elementene et "task" kort består av
        let dropZone = document.getElementById(card.status);
        let createCard = document.createElement("ARTICLE");          
        let createCardHeader = document.createElement("DIV");
        let createCardTitle = document.createElement("H3");
        let createCardTitleBtn = document.createElement("BUTTON");
        const createCardTitleBtnIcon = document.createElement("icon"); // Benjamin
        let createCardContent = document.createElement("DIV");
        let createCardMembersDiv = document.createElement("DIV");
        let createDeadLineDiv = document.createElement("DIV");
        let createDeadLineText = document.createElement("H3");
        
        card.userIcons.forEach(function(icon){
            let createPersonBadge = document.createElement("DIV");
            let userInitials = (getProjectmembersByIconId(icon).firstName.charAt(0) + getProjectmembersByIconId(icon).lastName.charAt(0)).toLocaleUpperCase();
            
            createPersonBadge.className = "person";
            createPersonBadge.innerText = userInitials;
            createCardMembersDiv.appendChild(createPersonBadge);
            
            
        });
        
        //setter klasse navnene
        createCard.className = "card-project";
        createCardHeader.className = "card-header";
        createCardTitle.className = "card-title";
        createCardTitleBtn.className = "card-title-button";
        createCardTitleBtnIcon.className = "fas fa-ellipsis-h"; // Klasse fra FontAwesome.com
        createCardContent.className = "card-content";
        
        createCardMembersDiv.classList.add("cm-grid-light");
        createCardMembersDiv.classList.add("card-members");
        createCardMembersDiv.id = "c-m";
        createDeadLineDiv.className = ""; //klassenavn
        createDeadLineDiv.id = "deadLineDiv";
        createDeadLineText.id ="deadLineDivText";
        
        
        createCardTitle.innerText = card.name;
        createDeadLineText.innerText = card.deadLine;
        
        createCardContent.innerText = card.description;
        createCardTitleBtnIcon.style.zIndex ="10";
        
        dropZone.appendChild(createCard);
        createCard.appendChild(createCardHeader);
        createCardHeader.appendChild(createCardTitle);
        createCardHeader.appendChild(createCardTitleBtn);
        createCardTitleBtn.appendChild(createCardTitleBtnIcon); // Benjamin
        createCard.appendChild(createCardContent);
        createCard.appendChild(createDeadLineDiv);
        createDeadLineDiv.appendChild(createDeadLineText);
        createCard.appendChild(createCardMembersDiv);
        
        
        createCard.id = card.elementId;
        createCard.draggable = true;
        createCard.ondragstart = dragstart_handler;
        createCardTitleBtn.onclick = onCardClick;                          
        console.log(card.elementId);
        }

    //
    function ondragLeave_handler(event){
        
    }

    //endrer zIndex på alle kortene unntatt "currentCard".
    function changeZIndex(currentCard, ZIndex){
        
        let columnHeaders = mainEl.querySelectorAll(".column-header");
            
        for(var i = 0; i < columnHeaders.length; i++){
            columnHeaders[i].style.zIndex = ZIndex;
        }
        for(var i = 0; i < cards.length; i++){
            if(cards[i].elementId != currentCard){
                let cardsElement = document.getElementById(cards[i].elementId);
                cardsElement.style.zIndex = ZIndex;
                
            }
        }
    }
    
    //Kjøres når man dropper et "card" i søppelkassa
    function cardDisposalDrop(event){
        event.preventDefault();
        let cardData = event.dataTransfer.getData("text/plain");
        
        changeZIndex(cardData, "10");
        deleteCard(cardData);
    }
    
    //tar inn en zoneId til en zone og sletter det fra arrayet og siden
    function deleteZone(zoneID){
        let targetZone= document.getElementById(zoneID);
        let currentZoneObj = getZoneObjectById(zoneID);
        
        targetZone.parentNode.removeChild(targetZone); 
        
        PrintOutActivityLog("zoneRemoved", currentZoneObj.name);
        
        //sletter kort objektene som lå i sonen som ble slettet fra cards[]
        let objToDelete = [];
        for(var i = 0; i < cards.length; i++){
            if(cards[i].status == currentZoneObj.elementId){
                objToDelete.push(cards[i]);
            
                
               }
            
        }
        
         for(var i = 0; i < objToDelete.length; i++){
                cards.splice(cards.indexOf(objToDelete[i]) , 1);
                
            }
        
        dropZones.splice(dropZones.indexOf(currentZoneObj), 1);
        updatePercentDone();
    }

    //tar inn element IDen til et kort og sletter det fra Siden og i Cards[] Arrayet.
    function deleteCard(cardId){
        let targetCard = document.getElementById(cardId);
        let currentCardObj = getCardObjectById(cardId);
        
        targetCard.parentNode.removeChild(targetCard);
        cards.splice(cards.indexOf(currentCardObj), 1);
        PrintOutActivityLog("cardRemoved", currentCardObj.name);
        updatePercentDone();
    }
    
    //Kjøres når man Holder et "card" over søppelkassa
    function cardDisposalDragOver(event){
       event.preventDefault();
      
    }
    
    //skriver inn element Iden og får returnert objektet til kortet
    function getCardObjectById(cId){
         for(var i = 0; i <cards.length; i++){
             
             if(cards[i].elementId == cId){
                 return cards[i];
             }
         }
    }
    
    //skriver inn element Iden og får returnert objektet til sonen/kolonnen
    function getZoneObjectById(zId){
        for(var i = 0; i < dropZones.length; i++){ 
             if(dropZones[i].elementId == zId){
                 return dropZones[i];
             } 
         }
        return {name: "feil"};
    }
    
    function getProjectmembersByIconId(iconId){
        for(var i = 0; i < projectmembers.length; i++){
            if(projectmembers[i].elementId == iconId){
                return projectmembers[i];
            }
        }
    }

    //regner ut hvor mange prosent ferdig prosjektet er
    function updatePercentDone(){
            
        let eachStepPercentage = 100/(dropZones.length-1);
        console.log("dropzones-1: " + (dropZones.length-1));
        
        let percentage = 0;
        
        for(var i = 1; i < dropZones.length; i++){
            cards.forEach(function(card){
                if(card.status == dropZones[i].elementId){
                    percentage += i*eachStepPercentage;
                }
                
            });    
            
        }
        
        percentage = Math.floor(percentage/cards.length);
        
      
        let percentBar = document.getElementById("progress"); 
        let percentageStr = (percentage+"%").toString();
        console.log(percentageStr);
        if((percentage <= 100) && (percentage > 1)){
            
            percentBar.innerText = percentageStr;
        }else{
            percentBar.innerText = "";
        }
        
        percentBar.style.width= percentageStr;
    }
    addCardBtn.addEventListener("click", AddCard);
    
    //add dropZone button
    addZoneBtn.addEventListener("click", AddZone);

    cardDisposal.ondrop = cardDisposalDrop;
    cardDisposal.ondragover = cardDisposalDragOver;

    //Puts column headers in darkmode if the darkmode cookie is "1"
    if(getCookie("darkmode") == "1"){
                styleClassBackgroundColor(columnHeaderClass, "#3a3a3a");
            } 


    
    
    
    
