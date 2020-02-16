var mymap = L.map('mapid').setView([28.654415, 77.209173], 13);
// pk.eyJ1IjoiaG93bGFuIiwiYSI6ImNrNXdxN3VyYzBxamYzbXBvcHYyZjZkY3MifQ.dBpg4rCfTg2vMOAJyEP-gg
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiaG93bGFuIiwiYSI6ImNrNXdxN3VyYzBxamYzbXBvcHYyZjZkY3MifQ.dBpg4rCfTg2vMOAJyEP-gg'
}).addTo(mymap);



App = {

        loading : false,
        contracts : {},
    
        load : async() => {
            await App.loadWeb3()
            await App.loadAccounts()
            await App.loadContracts()
            await App.render()
        },
    
        loadWeb3 : async() =>{
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider
                web3 = new Web3(web3.currentProvider)
            }
            else {
                window.alert("Please connect to Metamask.")
            }
                // Modern dapp browsers...
                if (window.ethereum) {
                    window.web3 = new Web3(ethereum);
                    try {
                        // Request account access if needed
                        await ethereum.enable();
                        // Acccounts now exposed
                        web3.eth.sendTransaction({/* ... */});
                    } catch (error) {
                        // User denied account access...
                    }
                }
                // Legacy dapp browsers...
                else if (window.web3) {
                    App.web3Provider = web3.currentProvider
                    window.web3 = new Web3(web3.currentProvider);
                    // Acccounts always exposed
                    web3.eth.sendTransaction({/* ... */});
                }
                // Non-dapp browsers...
                else {
                    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
                }
        },
    
        loadAccounts : async() => {
            App.account = web3.eth.accounts[0];
            
        },
    
        loadContracts : async() => {
            const accident = await $.getJSON('Accident.json');
            App.contracts.Accident = TruffleContract(accident);
            App.contracts.Accident.setProvider(App.web3Provider);
    
            App.accident = await App.contracts.Accident.deployed()
        },
        
        render: async() => {
                App.renderTasks();
        },
    
        renderTasks: async () => {
            // Load the total task count from the blockchain
            const siteCount = await App.accident.siteCount()
        
            // Render out each task with a new task template
            for (var i = 1; i <= siteCount; i++) {
                console.log(i)
              // Fetch the task data from the blockchain
              const sites = await App.accident.sites(i)
              const siteId = sites[0].toNumber()
              const area = sites[1]
              const xCoords = sites[2].toNumber()
              const yCoords = sites[3].toNumber()
        
              // Create the html for the task
              
                console.log(xCoords);
              // Show the task
              var marker = L.marker([xCoords, yCoords]).addTo(mymap);
              //$newTaskTemplate.show()
            }
        },
    
    
        createTaskGeo: async() =>{

            function success(position) {
                const latitude  = position.coords.latitude;
                const longitude = position.coords.longitude; 
                status.textContent = 'Located by API';
              }
            
              function error() {
                status.textContent = 'Unable to retrieve your location';
              }
            
              if (!navigator.geolocation) {
                status.textContent = 'Geolocation is not supported by your browser';
              } else {
                status.textContent = 'Locating…';
                navigator.geolocation.getCurrentPosition(success, error);
              }
            console.log(status.textContent);
            console.log(latitude);
            console.log(longitude);
            await App.accident.addSite(status.textContent,latitude,longitude)
            window.location.reload();
            
        },

        createTaskMan : async() => {
                area = $('#placeOfAccident').val();
                x = $('#xCoords').val();
                y = $('#yCoords').val();
                await App.accident.addSite(area,x,y)
                window.location.reload();
        },
    }
    
    $(() => {
        $(window).load(() => {
            App.load()
        }) 
    })
    