// Initialize Firebase

    var config = {
      apiKey: "AIzaSyCXiDPeEGlxW_d_JxvhwPZaU-i6Mq0STzs",
      authDomain: "carbuilder-bfbbb.firebaseapp.com",
      databaseURL: "https://carbuilder-bfbbb.firebaseio.com",
      projectId: "carbuilder-bfbbb",
      storageBucket: "carbuilder-bfbbb.appspot.com",
      messagingSenderId: "722130656742"
    };
    firebase.initializeApp(config);

// Connect to db
    var database = firebase.database();

var runningTotal = 0
$('.cost-display').text("$"+runningTotal);

var vehicleOptions = [
  {choice: 'cadenza', price: '35000'},
  {choice: 'forte', price: '20000'},
  {choice: 'optima', price: '29050'},
  {choice: 'sedona', price: '38650'},
  {choice: 'soul', price: '42200'}
];

var colorOptions = [
  {choice: 'black', price: '50'},
  {choice: 'white', price: '100'},
  {choice: 'silver', price: '250'}
];

var packageOptions = [
  {choice: 'Rear Camera', price: '150'},
  {choice: 'LED Positioning Light', price: '150'},
  {choice: 'Rear Create and LED Positioning Light', price: '200'}
];

// Create the shopping cart object
var carSelection = {
    vehicle: {choice: 'Not selected', price: 0},
    color: {choice: 'Not selected', price: 0},
    package: {choice: 'Not selected', price: 0}
}
$('li').on('click', function() {
    $('li').removeClass('active');
    $(this).addClass('active');
    var dataTab = $(this).data('tab');
    $('#options-display').empty();
    showTabContent(dataTab)
});

showTabContent('vehicle')

function showTabContent(tabName) {

    // Call showChoices and pass the various object arrays depending on the panel selected
    switch (tabName) {
        case 'vehicle':
            // Get and store the HTML source
            var source = $('#vehicle-options-template').html();
            // Compile and store the Handlebars template
            var template = Handlebars.compile(source);
            showChoices(vehicleOptions, template, tabName);
            break;
        case 'color':
            // Get and store the HTML source
            var source = $('#color-options-template').html();
            // Compile and store the Handlebars template
            var template = Handlebars.compile(source);
            showChoices(colorOptions, template, tabName)
            break;
        case 'package':
            // Get and store the HTML source
            var source = $('#package-options-template').html();
            // Compile and store the Handlebars template
            var template = Handlebars.compile(source);
            showChoices(packageOptions, template, tabName);
            break;
        case 'summary':
            // Get and store the HTML source
            var source = $('#summary-options-template').html();
            // Compile and store the Handlebars template
            var template = Handlebars.compile(source);
            showChoices(carSelection, template, tabName);
            break
    }
}

function showChoices(optionType, template, tabName) {
    // If summary
    if (tabName === 'summary') {
        // Create a variable for option details and pass summary data 
        var context = {
            vehicle: carSelection.vehicle,
            color: carSelection.color,
            package: carSelection.package
        }
        var html = template(context);
        // Add summary data to the option container in UI
        $('#options-display').append(html);
    // Else loop through to create the list of options (color, package, etc)
    } else {
        for (var i = 0; i < optionType.length; i++) {
            var objectType = optionType[i];
            var context = {
                feature: objectType.choice,
                price: objectType.price
            };
            var html = template(context);
            $('#options-display').append(html);
        }
    }
}

// Listen for a click on a choice in the tab 
// Type error in Summary tab when click the options pane.

$('.options-container').on('click','div[class*=option]', function() { 
    // Get which tab is selected and store it in a variable
    var selected = $(this).data('panel');
    // Get the options and prices for items in the selected tab
    carSelection[selected].choice = $(this).data('option');
    carSelection[selected].price = $(this).data('price');
    
    // Set the 'src' attribute of the image in the demo container
    // If a vehicle model and color are both selected,
    // set the new image using the selected using that vehicle and color option to build the image name
    if (carSelection['color'].choice !== 'Not selected' && carSelection['vehicle'].choice !== 'Not selected') {
            $('.vehicle-display').attr('src', 'assets/' + carSelection['vehicle'].choice + '-' + carSelection['color'].choice + '.jpg')
    // Otherwise, just use the default image for the car
    } else {
        if (carSelection[selected].choice !== 'Not selected') {
            $('.vehicle-display').attr('src', 'assets/' + carSelection[selected].choice + '.jpg')
        }
    }
    updateTotal(carSelection['vehicle'].price, carSelection['color'].price, carSelection['package'].price)

    // Update database
    var carSelectionReference = database.ref('carSelection');
    
    carSelectionReference.push({
        vehicle: carSelection['vehicle'].price,
        color: carSelection['color'].price,
        package: carSelection['package'].price 
    });
});


// QUESTION: Can't get comma in runningTotal
function updateTotal(vehiclePrice, colorPrice, packagePrice){
    runningTotal = vehiclePrice + colorPrice + packagePrice;
    runningTotal = numsWithcommas(runningTotal);
    $('.cost-display').text("$"+ runningTotal);
}

function numsWithcommas(num) {
  // Convert the number to an array of strings.
  var arr = num.toString().split('');

  // Counter wto group numbers into 3's 
  var counter = 1;

  // This array will contain the results will be
  // joined to form the final number with commas.
  var newArr = [];

  // Iterate backwards. After
  // each 3 numbers processed, add a comma.
  for (var i = arr.length - 1; i >= 0; i--) {

    // If the counter has reached 3, add a comma.
    if (counter === 3) {
      counter = 1; // Reset the counter to 1.
      newArr.unshift(arr[i]); // Put the current number into the beginning of the new array.
      
      // If loop is at the last number, prevent a leading comma.
      // Only add the comma at the beginning if `i` is not 0 (the last number).
      if (i !== 0) {
        newArr.unshift(',');
      }

    // If the counter has not reached 3, add the
    // current number to the new array and up the counter by 1.
    } else {
      newArr.unshift(arr[i]);
      counter++;
    }
  }

  // Take the array of commas and numbers, and join them together.
  return newArr.join('');
}

















