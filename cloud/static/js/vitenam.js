// ################################################################################################ //
// ####################################### JAVA SCRIPT CODE ####################################### //
// ################################################################################################ //

// let cameraSelected = false;

  //   async function db_backup() {
  //     try {
  //         clearAnalysisTable();
  //         const totalData = await getCameraDataFromServer('mold-0001'); // Assuming 'mold-0001' is the camera name
  //         if (!totalData || typeof totalData !== 'object') {
  //             throw new Error('Invalid data received from server');
  //         }

  //         const totalDetections = totalData.total_detections;
  //         const totalAnomalies = totalData.total_anomalies;

  //         // Display total detections and anomalies in a table
  //         createTotalsTable(totalDetections, totalAnomalies);

  //         // Show the totals table container
  //         const totalsTableContainer = document.getElementById('totalsTableContainer');
  //         totalsTableContainer.style.display = 'block';
  //     } catch (error) {
  //         console.error('Error backing up database:', error);
  //     }
  // }

  //   function createTotalsTable(totalDetections, totalAnomalies) {
  //     // Get the container element where the table will be displayed
  //     const container = document.getElementById('totalsTableContainer');

  //     // Create the table element
  //     const table = document.createElement('table');
  //     table.id = 'totalsTable';

  //     // Create the table header row
  //     const headerRow = table.insertRow();
  //     const header1 = document.createElement('th');
  //     const headerLink1 = createLink('Total Detections', totalDetections);
  //     header1.appendChild(headerLink1);

  //     const header2 = document.createElement('th');
  //     const headerLink2 = createLink('Total NG', totalAnomalies);
  //     header2.appendChild(headerLink2);

  //     const header3 = document.createElement('th');
  //     header3.textContent = 'Time';

  //     headerRow.appendChild(header1);
  //     headerRow.appendChild(header2);
  //     headerRow.appendChild(header3);

  //     // Create the data row
  //     const dataRow = table.insertRow();
  //     const cell1 = dataRow.insertCell();
  //     cell1.textContent = totalDetections;

  //     const cell2 = dataRow.insertCell();
  //     cell2.textContent = totalAnomalies;

  //     const cell3 = dataRow.insertCell();
  //     const currentTime = new Date().toLocaleString();
  //     cell3.textContent = currentTime;

  //     // Clear any existing content in the container
  //     container.innerHTML = '';

  //     // Append the table to the container
  //     container.appendChild(table);

  //     // Display graph when link is clicked
  //     headerLink1.addEventListener('click', () => {
  //         displayGraph('Total Detections', detectionsData);
  //     });

  //     headerLink2.addEventListener('click', () => {
  //         displayGraph('Total NG', anomaliesData);
  //     });
  // }
  
  async function db_backup() {
    try {
        clearAnalysisTable();
        const anomaliesData = await getAnomaliesDataFromServer('mold-0001'); // Assuming 'mold-0001' is the camera name
        if (!anomaliesData || !Array.isArray(anomaliesData)) {
            throw new Error('Invalid anomalies data received from server');
        }

        // Display anomalies data in a table
        displayAnomaliesTable(anomaliesData);

        // Show the anomalies table container
        const anomaliesTableContainer = document.getElementById('anomaliesTableContainer');
        anomaliesTableContainer.style.display = 'block';
    } catch (error) {
        console.error('Error backing up database:', error);
    }
}

  async function getAnomaliesDataFromServer(cameraName) {
    try {
        const response = await fetch(`/get_anomalies_data/${cameraName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch anomalies data');
        }
        const data = await response.json();
        return data.anomalies;
    } catch (error) {
        console.error('Error fetching anomalies data:', error);
        throw error;
    }
}

  async function displayAnomaliesTable(anomaliesData) {
    try {
        clearAnomaliesTable(); // Clear previous anomalies table data
        
        const anomaliesTableContainer = document.getElementById('anomaliesTableContainer');
        anomaliesTableContainer.innerHTML = ''; // Clear previous table content
        
        const table = document.createElement('table');
        table.id = 'NGTable';
        table.border = '2';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow1 = document.createElement('tr');
        const headers1 = ['Camera', 'Status', 'Trigger Matching Similarity', 'Proc Time (ms)', 'Timestamp'];
        headers1.forEach((headerText, index) => {
          const th = document.createElement('th');
          th.textContent = headerText;
          if (index === 2) { // For the "Trigger Matching Similarity" header
              th.colSpan = 2; // Set colspan attribute to 2
          }
          headerRow1.appendChild(th);
        });
        thead.appendChild(headerRow1);

        // Create second row for the header
        const headerRow2 = document.createElement('tr');
        const headers2 = ['', '', 'Cast Similarity', 'Connector Similarity', '', ''];
        headers2.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow2.appendChild(th);
        });
        thead.appendChild(headerRow2);

        // Populate table with anomalies data
        const tbody = document.createElement('tbody');
        anomaliesData.forEach(anomaly => {
            const { camera, status, trigger_matching_similarity, proc_time, timestamp } = anomaly;
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = camera;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = status;
            row.appendChild(cell2);
            
            const cell3 = document.createElement('td');
            const castSimilarity = document.createElement('span');
            castSimilarity.textContent = trigger_matching_similarity['cast_similarity'].toFixed(2); // Round to 2 decimal points
            cell3.appendChild(castSimilarity);
            row.appendChild(cell3);
            
            const cell4 = document.createElement('td');
            const connectorSimilarity = document.createElement('span');
            connectorSimilarity.textContent = trigger_matching_similarity['connector_similarity'].toFixed(2); // Round to 2 decimal points
            cell4.appendChild(connectorSimilarity);
            row.appendChild(cell4);
            
            const cell5 = document.createElement('td');
            cell5.textContent = proc_time;
            row.appendChild(cell5);
            
            const cell6 = document.createElement('td');
            cell6.textContent = timestamp;
            row.appendChild(cell6);
            
            tbody.appendChild(row);
        });

        // Append table to container
        table.appendChild(thead);
        table.appendChild(tbody);
        anomaliesTableContainer.appendChild(table);
    } catch (error) {
        console.error('Error displaying anomalies table:', error);
    }
}

  function clearAnomaliesTable() {
    const anomaliesTableContainer = document.getElementById('anomaliesTableContainer');
    anomaliesTableContainer.innerHTML = ''; // Clear the table content
}

  function createLink(value, label) {
    const link = document.createElement('a');
    link.textContent = value;
    link.href = '#';
    link.onclick = function() {
        displayGraph(label, value);
        return false;
    };
    return link;
}

  function displayGraph(label, data) {
    const chartData = {
        labels: data.map(entry => entry.time),
        datasets: [{
            label: label,
            data: data.map(entry => entry.value),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    const ctx = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

  function clearAnalysisTable() {
    const tableBody = document.querySelector('#dataTable');
    tableBody.innerHTML = ''; // Clear all rows from the table body
}


  function refreshPage() {
      location.reload();
  }

  function addCamera() {
      var newCameraName = prompt("Enter the name for the new camera:");
      if (newCameraName) {
          // Perform necessary actions to add the new camera
          // For example, make an API call to add the camera with the name newCameraName
          // After adding the camera, update the camera list UI
          var cameraDropdown = document.getElementById("cameraList");
          var newCameraListItem = document.createElement("li");
          newCameraListItem.innerHTML = `
              <div class="camera-list-item">
                  <a href="#" class="list-item-text" onclick="showButtons(this, '${newCameraName}', event)">${newCameraName}</a>
                  <span class="action-icon" onclick="changeCamera('${newCameraName}')">Change <i class="fas fa-edit"></i></span>
                  <span class="action-icon" onclick="deleteCamera('${newCameraName}')">Delete <i class="fas fa-trash"></i></span>
              </div>`;
          cameraDropdown.appendChild(newCameraListItem);
      }
  }

  function changeCamera(cameraName) {
    var newName = prompt("Enter new name for camera " + cameraName + ":");
    if (newName != null && newName != "") {
        console.log("New name for camera " + cameraName + ": " + newName);
        // Update the camera name in the UI
        var cameraLink = document.querySelector(".list-item-text[data-camera='" + cameraName + "']");
        cameraLink.textContent = newName;
    }
}

  function deleteCamera(cameraName) {
    var confirmation = confirm("Are you sure you want to delete camera " + cameraName + "?");
    if (confirmation) {
        console.log("Camera " + cameraName + " deleted.");
        // Remove the camera from the UI
        var cameraLink = document.querySelector(".list-item-text[data-camera='" + cameraName + "']");
        if (cameraLink) {
            var cameraItem = cameraLink.parentNode.parentNode;
            cameraItem.parentNode.removeChild(cameraItem);
        } else {
            console.error("Camera element not found.");
        }
    }
}


  function showSTTInformation(sttInfo) {
    const sttContainer = document.getElementById("sttContainer");
    sttContainer.textContent = `STT: ${JSON.stringify(sttInfo)}`;
  }

  async function getCameraDataFromServer(cameraName) {
      try {
          const response = await fetch(`/get_camera_data/${encodeURIComponent(cameraName)}`);

          if (response.ok) {
              return await response.json();
          } else if (response.status === 404) {
              // Return a default object or handle the absence of data as needed
              return null;
          } else {
              throw new Error(`Failed to fetch data for ${cameraName}. HTTP Status: ${response.status}`);
          }
      } catch (error) {
          // Handle or log the error
          console.error(`Error fetching data for ${cameraName}:`, error);
          throw error;
      }
  }

//     async function toggleCameraList(event) {
//       event.preventDefault();
//       const cameraList = document.getElementById("cameraList");

//       if (cameraList.style.display === "none") {
//           // Show the camera lists
//           cameraList.style.display = "block";
//       } else {
//           // Hide the camera list
//           cameraList.style.display = "none";
//           clearCameraData(); 
//           return;
//       }

//       // Fetch and display data for each camera when the list is shown
//       if (cameraList.style.display === "block") {
//           const cameraOptions = document.querySelectorAll('.list_items');
//           console.log(cameraData); 

//           await Promise.all(Array.from(cameraOptions).map(async (cameraOption) => {
//             // displayCameraData(cameraOption, cameraName, infoString);

//             const cameraDataElement = cameraOption.querySelector('.camera-data');
//             if (cameraDataElement) {
//                 cameraDataElement.innerHTML = '';
//             }

//             const cameraName = cameraOption.textContent.trim();
//             try {
//                 const cameraData = await getCameraDataFromServer(cameraName);

//                 // Change the color of the camera icon based on data availability
//                 const cameraIcon = cameraOption.querySelector('.camera-icon');
//                 console.log('cameraIcon:', cameraIcon);

//                 if (cameraIcon) {
//                   if (cameraData === null || cameraData === undefined) {
//                         // Data is available, change color to green
//                         cameraIcon.style.color = "red";
//                     } else {
//                         // No data available, change color to red
//                         cameraIcon.style.color = "green";
//                     }
//                 }

//                 // Display camera data in the desired format
//                 if (cameraData) {
//                     const infoString = `Total Detections: ${cameraData.total_detections}, Total NG: ${cameraData.total_anomalies}, Time: ${cameraData.current_time}`;
//                     cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - ${infoString}`;
//                     if (cameraDataElement) {
//                       cameraDataElement.innerHTML = '';
//             }
//                 } else {
//                     cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - No data available`;
//                     if (cameraDataElement) {
//                       cameraDataElement.innerHTML = 'No data available';
//                   }
//                 }
//             } catch (error) {
//                 console.error(`Error while updating data for ${cameraName}:`, error);
//                 cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - Error fetching data`;
//                 if (cameraDataElement) {
//                   cameraDataElement.innerHTML = 'Error fetching data'; // Update camera data
//               }
//             }
//         }));
//     }
// }

//   async function toggleCameraList(event) {
//     event.preventDefault();
//     const cameraList = document.getElementById("cameraList");

//     if (cameraList.style.display === "none") {
//         // Show the camera lists
//         cameraList.style.display = "block";
//     } else {
//         // Hide the camera list
//         cameraList.style.display = "none";
//         clearCameraData(); // Clear previous camera data
//         return;
//     }

//     // Fetch and display data for each camera when the list is shown
//     if (cameraList.style.display === "block") {
//         const cameraOptions = document.querySelectorAll('.list_items');

//         await Promise.all(Array.from(cameraOptions).map(async (cameraOption) => {
//             const cameraName = cameraOption.textContent.trim();

//             // Clear previous camera data for this camera option
//             const cameraDataElement = cameraOption.querySelector('.camera-info');
//             if (cameraDataElement) {
//                 cameraDataElement.innerHTML = '';
//             }

//             // const cameraName = cameraOption.textContent.trim();
//             try {
//                 const cameraData = await getCameraDataFromServer(cameraName);

//                 // Display camera data in the desired format
//                 if (cameraData) {
//                     const infoString = `Total Detections: ${cameraData.total_detections}, Total NG: ${cameraData.total_anomalies}, Time: ${cameraData.current_time}`;
//                     cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - ${infoString}`;
//                     if (cameraDataElement) {
//                         cameraDataElement.innerHTML = infoString;
//                     }
//                 } else {
//                     cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - No data available`;
//                     if (cameraDataElement) {
//                         cameraDataElement.innerHTML = 'No data available';
//                     }
//                 }
//             } catch (error) {
//                 console.error(`Error while updating data for ${cameraName}:`, error);
//                 cameraOption.innerHTML = `<i class="camera-icon fas fa-video"></i> ${cameraName} - Error fetching data`;
//                 if (cameraDataElement) {
//                     cameraDataElement.innerHTML = 'Error fetching data'; // Update camera data
//                 }
//             }
//         }));
//     }
// }

  async function toggleCameraList(event) {
    event.preventDefault();
    const cameraList = document.getElementById("cameraList");

    if (cameraList.style.display === "none") {
        // Show the camera lists
        cameraList.style.display = "block";
    } else {
        // Hide the camera list
        cameraList.style.display = "none";
        clearCameraData(); // Clear previous camera data
        return;
    }

    // Fetch and display data for each camera when the list is shown
    if (cameraList.style.display === "block") {
        const cameraOptions = document.querySelectorAll('.list_items');

        await Promise.all(Array.from(cameraOptions).map(async (cameraOption) => {
            const cameraName = cameraOption.textContent.trim();
            try {
                const cameraData = await getCameraDataFromServer(cameraName);
                displayCameraData(cameraOption, cameraName, cameraData);
                updateColor(cameraOption, cameraData);
            } catch (error) {
                console.error(`Error while updating data for ${cameraName}:`, error);
                displayError(cameraOption, cameraName);
                updateColor(cameraOption, null);
            }
        }));

          // Call the function initially
        updateCameraIconColors();

        // Call the function every 1 minute (60000 milliseconds)
        setInterval(updateCameraIconColors, 60000);
    } else {
        // Hide the camera list
        cameraList.style.display = "none";
        clearCameraData(); // Clear previous camera data
        return;
  }
}


  function clearCameraData() {
    const cameraOptions = document.querySelectorAll('.list_items');
    cameraOptions.forEach(cameraOption => {
        const cameraDataContainer = cameraOption.querySelector('.camera-data');
        if (cameraDataContainer) {
            cameraDataContainer.innerHTML = ''; // Clear previous camera data
        }
    });
}

  function displayCameraData(cameraOption, camera, data) {
    if (cameraOption) {
        let cameraDataContainer = cameraOption.querySelector('.camera-data');
        if (!cameraDataContainer) {
            cameraDataContainer = document.createElement('div');
            cameraDataContainer.classList.add('camera-data');
            cameraOption.appendChild(cameraDataContainer);
        }
        cameraDataContainer.innerHTML = `Total Detections: ${data.total_detections}, Total NG: ${data.total_anomalies}, Time: ${data.current_time}`;
    } else {
        console.error('Camera option element is null.');
    }
}

  function displayError(cameraOption, camera) {
    if (cameraOption) {
        let cameraDataContainer = cameraOption.querySelector('.camera-data');
        if (!cameraDataContainer) {
            cameraDataContainer = document.createElement('div');
            cameraDataContainer.classList.add('camera-data');
            cameraOption.appendChild(cameraDataContainer);
        }
        cameraDataContainer.innerHTML = `Error fetching data for camera: ${camera}`;
    } else {
        console.error('Camera option element is null.');
    }
}

  function updateColor(cameraOption, cameraData) {
    const cameraIcon = cameraOption.querySelector('.camera-icon');
    
    // Check if cameraData is available and has only one entry
    if (cameraData && cameraData.total_entries === 1) {
        cameraIcon.classList.remove('available');
        cameraIcon.classList.add('unavailable');
    } else {
        cameraIcon.classList.remove('unavailable');
        cameraIcon.classList.add('available');
    }
}

    // Define a function to update camera icon colors based on last update time
  async function updateCameraIconColors() {
      const cameraOptions = document.querySelectorAll('.list_items');

      cameraOptions.forEach(async (cameraOption) => {
          const cameraName = cameraOption.textContent.trim();
          try {
              const cameraData = await getCameraDataFromServer(cameraName);
              updateColor(cameraOption, cameraData);
          } catch (error) {
              console.error(`Error while updating data for ${cameraName}:`, error);
              updateColor(cameraOption, null);
          }
      });
  }
  

//   function updateColor(cameraOption, cameraData) {
//     const cameraIcon = cameraOption.querySelector('.camera-icon');

//     // Check if cameraData is available and has only one entry
//     if (cameraData && cameraData.total_entries === 1) {
//         cameraIcon.classList.remove('unavailable');
//         cameraIcon.classList.add('available');
//     } else {
//         cameraIcon.classList.remove('available');
//         cameraIcon.classList.add('unavailable');
//     }

//     // Check the timestamp of the last data entry
//     if (cameraData && cameraData.last_entry_timestamp) {
//         const lastEntryTimestamp = new Date(cameraData.last_entry_timestamp);
//         const currentTime = new Date();
//         const timeDifferenceMinutes = (currentTime - lastEntryTimestamp) / (1000 * 60);

//         // If the time difference exceeds 5 minutes, change the camera icon to red
//         if (timeDifferenceMinutes > 5) {
//             cameraIcon.classList.add('red');
//         } else {
//             cameraIcon.classList.remove('red');
//         }
//     }
// }


  // for select cameraIcon display ###########################################################
  
//   async function toggleCameraList(event) {
//     event.preventDefault();
//     const cameraList = document.getElementById("cameraList");

//     if (cameraList.style.display === "none") {
//         // Show the camera list
//         cameraList.style.display = "block";
//     } else {
//         // Hide the camera list
//         cameraList.style.display = "none";
//     }

//     // Fetch and display data for each camera when the list is shown
//     if (cameraList.style.display === "block") {
//         const cameraOptions = document.querySelectorAll('.list_items');
//         await Promise.all(Array.from(cameraOptions).map(async (cameraOption) => {
//             const cameraName = cameraOption.textContent.trim();
//             try {
//                 const cameraData = await getCameraDataFromServer(cameraName);

//                 // Change the color of the camera icon based on data availability
//                 const cameraIcon = document.getElementById("cameraIcon");
//                 // const cameraIcon = cameraOption.querySelector(".fas.fa-video");

//                 if (cameraData) {
//                     // Data is available, change color to green
//                     cameraIcon.style.color = "green";
//                 } else {
//                     // No data available, change color to red
//                     cameraIcon.style.color = "red";
//                 }

//                 // Display camera data in the desired format
//                 if (cameraData) {
//                     const infoString = `Total Detections: ${cameraData.total_detections}, Total NG: ${cameraData.total_anomalies}, Time: ${cameraData.current_time}`;
//                     cameraOption.innerHTML = `<div class="list_items">${cameraName} - ${infoString}</div>`;
//                 } else {
//                     cameraOption.innerHTML = `<div class="list_items">${cameraName} - No data available</div>`;
//                 }
//             } catch (error) {
//                 console.error(`Error while updating data for ${cameraName}:`, error);
//                 cameraOption.innerHTML = `<div class="list_items">${cameraName} - Error fetching data</div>`;
//             }
//         }));
//     }
// }
// for select cameraIcon display ###########################################################


  // async function toggleCameraList() {
  //     const cameraList = document.getElementById("cameraList");
  //     const buttonsContainer = document.getElementById("buttonsContainer");

  //     if (cameraList.style.display === "none") {
  //         // Show the camera list
  //         cameraList.style.display = "block";
  //         hideButtons();
  //         buttonsContainer.style.display = "none";
  //     } else {
  //         // Hide the camera list
  //         cameraList.style.display = "none";
  //     }

  //     const cameraNumbersContainer = document.getElementById("cameraNumbersContainer");
  //     const cameraDataContainer = document.getElementById("cameraDataContainer");

  //     // Clear previous data
  //     cameraNumbersContainer.innerHTML = '';
  //     cameraDataContainer.innerHTML = '';

  //     if (cameraList.style.display === "block") {
  //         // Fetch and display data for each camera
  //         const cameraOptions = document.querySelectorAll('.list_items');
  //         await Promise.all(Array.from(cameraOptions).map(async (cameraOption) => {
  //             const cameraName = cameraOption.textContent.trim();

  //             try {
  //                 const cameraData = await getCameraDataFromServer(cameraName);

  //                 const infoString = cameraData
  //                     ? `<span class="camera-number">${cameraName}</span> - <span class="camera-info">STT: ${cameraData.stt.join(', ')}, Trigger: ${JSON.stringify(cameraData.trigger_matching_similarity)}, Time: ${cameraData.ts}, Total Anomalies: ${cameraData.total_anomalies}, Total Detections: ${cameraData.total_detections}</span>`
  //                     : `<span class="camera-number">${cameraName}</span> - No data available`;

  //                 const updatedContent = `<div class="list_items">${infoString}</div>`;
  //                 cameraOption.innerHTML = updatedContent;
  //             } catch (error) {
  //                 console.error(`Error while updating data for ${cameraName}:`, error);
  //                 const errorContent = `<div class="list_items">${cameraName} - Error fetching data</div>`;
  //                 cameraNumbersContainer.insertAdjacentHTML('beforeend', errorContent);
  //             }
  //         }));
  //     }
  // }

  // async function getCameraDataFromServer(cameraName) {
  //     try {
  //         const response = await fetch(`/get_camera_data/${cameraName}`);

  //         if (response.ok) {
  //             return await response.json();
  //         } else if (response.status === 404) {
  //             // Return a default object or handle the absence of data as needed
  //             return null;
  //         } else {
  //             throw new Error(`Failed to fetch data for ${cameraName}. HTTP Status: ${response.status}`);
  //         }
  //     } catch (error) {
  //         // Do nothing or handle the error gracefully
  //         throw error;
  //     }
  // }


  // function toggleCameraList() {
  //   const cameraList = document.getElementById("cameraList");
  //   cameraList.style.display = cameraList.style.display === "none" ? "block" : "none";
  //   hideButtons(); // Hide buttons when toggling camera list
  // }


  function handleAnalysis() {

    // Call performAnalysis once the camera is selected
    performAnalysis();
    // clearTotalsTable();
    clearAnomaliesTable
  }

  function showButtons(clickedButton, selectedCamera, event, analysisCallback) {
    const buttonsContainer = document.getElementById("buttonsContainer");
    const cameraList = document.getElementById("cameraList");

    // Set the selected camera text
    document.getElementById("selectedCamera").textContent = `Selected Camera: ${selectedCamera}`;

    // Set the selected camera globally (if needed)
    selectedCamera = selectedCamera.replace("Camera_", "");

    // Remove 'selected' class from all buttons
    const allButtons = document.querySelectorAll('.list_items');
    allButtons.forEach(button => button.classList.remove('selected'));

    // Add 'selected' class to the clicked button
    clickedButton.classList.add('selected');

    // Hide the camera list
    cameraList.style.display = "none";

    // Show the buttons container
    buttonsContainer.style.display = "block";

    // Set the cameraSelected flag to true
    cameraSelected = true;

    // fetchDataFromServer(selectedCamera)

    // updateCameraData(selectedCamera);
    // displayDefaultCameraData(selectedCamera);
    // cameraInfoContainer.style.display = "block";
    // displayCameraInfo(selectedCamera);

    // Prevent the default action to stop event propagation
    event.stopPropagation();

    // Call the analysisCallback function if provided
    if (typeof analysisCallback === 'function') {
      analysisCallback();
    }
  }



  function getReceivedData() {
    // Replace this example data with your actual received data
    return {
      "Camera_1": {
        stt: [6, 11, 9],
        ts: 84942,
        fbc: 174,
        trigger_matching_similarity: { "0": 17.179660499095917, "1": 16.796107590198517 },
        det: { dets: {}, trk: {}, refid: 1, nimg: 0 },
        proc_time: 16
      },
      "Camera_2": {
        // Add data for Camera_2 as needed
      },
      // Add entries for other cameras as needed
    };
  }

  function displayCameraInfo(selectedCamera) {
    const receivedDataDiv = document.getElementById('receivedData');
    const receivedDataString = receivedDataDiv.innerText;

    if (receivedDataString) {
      const receivedData = JSON.parse(receivedDataString);

      if (receivedData[selectedCamera] && receivedData[selectedCamera].stt) {
        const cameraData = receivedData[selectedCamera];
        receivedDataDiv.innerHTML = `
          <p>Camera: ${selectedCamera}</p>
          <p>STT: ${cameraData.stt.join(', ')}</p>
          <p>Trigger: ${JSON.stringify(cameraData.trigger_matching_similarity)}</p>
          <p>Time: ${cameraData.ts}</p>
          <p>Selected Camera: ${selectedCamera}</p>
        `;
      } else {
        receivedDataDiv.innerHTML = `No data available for ${selectedCamera}`;
      }
    } else {
      receivedDataDiv.innerHTML = 'No data available';
    }
  }

  function displayDefaultCameraData(selectedCamera, data) {
    const cameraDataContainer = document.getElementById('cameraData');
    const cameraDataItem = document.createElement('div');

    if (data && data.stt && data.trigger_matching_similarity) {
      cameraDataItem.innerHTML = `
        <p>Camera: ${selectedCamera}</p>
        <p>Status: ${data.stt.join(', ')}</p>
        <p>Trigger Matching Similarity:</p>
        <ul>
          <li>Trigger 0: ${data.trigger_matching_similarity[0]}</li>
          <li>Trigger 1: ${data.trigger_matching_similarity[1]}</li>
        </ul>
      `;
    } else {
      cameraDataItem.innerHTML = `<p>No data available for ${selectedCamera}</p>`;
    }

    // Clear existing content and append the new data
    cameraDataContainer.innerHTML = '';
    cameraDataContainer.appendChild(cameraDataItem);
  }
                


  // function updateCameraData(selectedCamera) {
  //   const cameraDataDiv = document.getElementById('cameraData');

  //   // Fetch and display data for the selected camera
  //   fetchDataForCamera(selectedCamera, (data) => {
  //     cameraDataDiv.innerHTML = `
  //       <p>Camera: ${selectedCamera}</p>
  //       <p>Status: ${data.stt ? data.stt.join(', ') : 'N/A'}</p>
  //       <p>Timestamp: ${data.ts ? data.ts : 'N/A'}</p>
  //       <p>Frame Byte Count: ${data.fbc ? data.fbc : 'N/A'}</p>
  //       <p>Trigger Matching Similarity:</p>
  //       <ul>
  //         <li>Trigger 0: ${data.trigger_matching_similarity ? data.trigger_matching_similarity[0] : 'N/A'}</li>
  //         <li>Trigger 1: ${data.trigger_matching_similarity ? data.trigger_matching_similarity[1] : 'N/A'}</li>
  //       </ul>
  //       <p>Detections:</p>
  //       <ul>
  //         <li>Number of Images: ${data.det ? data.det.nimg : 'N/A'}</li>
  //         <!-- Add more details about detections if needed -->
  //       </ul>
  //       <p>Processing Time: ${data.proc_time ? data.proc_time : 'N/A'}</p>
  //     `;
  //   });
  // }

  // function updateCameraBlock(selectedCamera, sttInfo) {
  //   const cameraBlockId = `camera_${selectedCamera}`;

  //   // Check if the camera block exists, if not, create it
  //   let cameraBlock = document.getElementById(cameraBlockId);
  //   if (!cameraBlock) {
  //     cameraBlock = document.createElement('div');
  //     cameraBlock.id = cameraBlockId;
  //     document.body.appendChild(cameraBlock);
  //   }

  //   // Find or create the STT element inside the camera block
  //   let sttElement = document.getElementById(`${cameraBlockId}_stt`);
  //   if (!sttElement) {
  //     sttElement = document.createElement('p');
  //     sttElement.id = `${cameraBlockId}_stt`;
  //     cameraBlock.appendChild(sttElement);
  //   }

  //   // Display the STT information
  //   sttElement.textContent = `STT: ${JSON.stringify(sttInfo)}`;
  // }

  function hideButtons() {
    const buttonsContainer = document.getElementById("buttonsContainer");
    buttonsContainer.style.display = "none";
  }

// ################################################################################# //  
// ################################# MQTT ########################################## //
// ################################################################################# //
let client;
// let analysisTopic;
let machine_mqtt; // Declare machine_mqtt globally
let selectedCamera = "";

  function mqtt_connection(callback){
      const machines={
          0:'mold-0001',  //  msis lab test system 
          1:'ket-pin-1',  
          2:'ket-pin-2',  
          3:'ket-pin-3',
          4:'ket-pin-4',
          5:'ket-pin-5', 
          // 6:'ket-pin-4',  
          // 7:'ket-pin-5',  
          // 8:'ket-pin-6',  
          // 9:'ket-pin-7',  
      }

      clientID = "clientID - "+parseInt(Math.random() * 100); // Create random client 
    
      host_ = '100.115.26.20'; 
      // host_ = '100.107.127.31'; 
      // host_ = '10.125.150.39';     
      port = 9001; 
      // const topic = 'smartfactory/message/mold-0004/#';
        // Set the selected topic to coresponding camera 
      const selectedCameraText = document.getElementById("selectedCamera").innerText;
      console.log("Selected Camera:", selectedCameraText);

      const match = selectedCameraText.match(/\d+/);
      const selectedCameraIndex = match ? parseInt(match[0]) - 1 : -1; // Adjust index to start from 0

      if (selectedCameraIndex in machines) {
          const machine_id = machines[selectedCameraIndex];
          const camera_id = selectedCameraIndex;

          console.log('Selected Machine ID:', machine_id, 'Camera ID:', camera_id);

          if (typeof callback === 'function') {
            callback({ machine_id, camera_id });
          }

          return { machine_id, camera_id };
      } else {
          console.error('Invalid camera index:', selectedCameraIndex);
          return null;
      }
}

  function startConnect(callback){

    clientID = "clientID - "+parseInt(Math.random() * 100); // Create random client 

    host_ = '100.115.26.20'; 
    // host_ = '10.125.150.39';     
    port = 9001;  

    // document.getElementById("messages").innerHTML += "<span> Connecting to : " + host_ + " on port :--> " +port+"</span><br>";
    // document.getElementById("messages").innerHTML += "<span> Using the client Id " + clientID +" </span><br>";

    client = new Paho.MQTT.Client(host_,Number(port),clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
      onSuccess: function () {
        console.log('Connected to MQTT broker');
        machine_mqtt = mqtt_connection();
        if (machine_mqtt) {
          const analysisTopic = `smartfactory/message/${machine_mqtt.machine_id}/#`;
          client.subscribe(analysisTopic);

          // Subscribe to the analysis topic once the connection is established
          client.subscribe(analysisTopic);

          if (typeof callback === 'function') {
            callback(); // Call the callback function once connected
          }

          // Set up a callback for when a message is received on the subscribed topic
          client.onMessageArrived = function (message) {
            // Process the received message and update the UI
            console.log('Received message:', message.payloadString);
            const parsedMessage = JSON.parse(message.payloadString);
            updateTable(parsedMessage);
            saveDataFromMessage(parsedMessage);
          };
        }
      },
      onFailure: function (message) {
        console.error('Connection failed:', message.errorMessage);
      }
    });
  }

  function onConnect(callback) {
    console.log('Connected to MQTT broker');  // mqtt client has successfully connected tyo mqtt broker
    const numCameras = 10;
    // Subscribe to topics for each camera
    for (let i = 1; i <= numCameras; i++) {
        topics.forEach(topic => {
          const analysisTopic = `smartfactory/message/${machine_mqtt.machine_id}/#`;
            // topic =  document.getElementById("topic_s").value;
            // document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";
            client.subscribe(analysisTopic);

            // client subscribes to a set of topics for each camera 
            // listening for messages on topics corresponding to each camera
        });
    }
    if (typeof callback === 'function') {
      callback(); // Call the callback function once connected
}
}

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('Connection lost:', responseObject.errorMessage);
    }
    // handles the event when mqtt client loses connection to broker 
  }
      
  function onMessageArrived(message) {
    console.log('Received message:', message.payloadString);

    // Add a log statement to check if data is received
    console.log('Data received:', message.payloadString);
    
    // Extract the camera number from the topic
    const cameraNumber = message.destinationName.split('/').pop();
    const topicParts = message.destinationName.split('/');
    const topic = topicParts[topicParts.length - 2];

    // Handle the received message based on the topic
    switch (topic) {
        case 'message':
            tem_msg = message.payloadString;
            break;
        case 'trigger':
            tem_trg = message.payloadString;
            break;
        case 'control':
            tem_contrl = message.payloadString;
            break;
    }

    // Check if all messages are received
    if (tem_msg && tem_trg && tem_contrl) {
        messageHandler(tem_msg, tem_trg, tem_contrl, cameraNumber);
        updateTable(tem_msg);

        // Display received data in the "receivedData" div
        const receivedDataDiv = document.getElementById('receivedData');
        receivedDataDiv.innerHTML = `
            <p>Received Data:</p>
            <p>Message: ${tem_msg}</p>
            <p>Trigger: ${tem_trg}</p>
            <p>Control: ${tem_contrl}</p>
        `;
    }
      // Save the received data to the database
        const machine_mqtt = mqtt_connection();
        const camera = machine_mqtt.camera_id;
        const status = tem_msg.stt.join(',');
        const parsedMessage = JSON.parse(message.payloadString);
        saveDataToDatabase(camera, status, parsedMessage.trigger_matching_similarity, parsedMessage.det, parsedMessage.proc_time)
  }

//   function onMessageArrived(message) {
//     console.log('Received message:', message.payloadString);

//     // Extract the camera number from the topic
//     const cameraNumber = message.destinationName.split('/').pop();
//     const topicParts = message.destinationName.split('/');
//     const topic = topicParts[topicParts.length - 2];

//     // Initialize an object to store data for each camera
//     if (!cameraData[cameraNumber]) {
//         cameraData[cameraNumber] = {};
//     }

//     // Handle the received message based on the topic
//     switch (topic) {
//         case 'message':
//             cameraData[cameraNumber].tem_msg = message.payloadString;
//             break;
//         case 'trigger':
//             cameraData[cameraNumber].tem_trg = message.payloadString;
//             break;
//         case 'control':
//             cameraData[cameraNumber].tem_contrl = message.payloadString;
//             break;
//     }

//     // Check if all messages are received for the current camera
//     if (
//         cameraData[cameraNumber].tem_msg &&
//         cameraData[cameraNumber].tem_trg &&
//         cameraData[cameraNumber].tem_contrl
//     ) {
//         // Process the received data for the current camera
//         messageHandler(
//             cameraData[cameraNumber].tem_msg,
//             cameraData[cameraNumber].tem_trg,
//             cameraData[cameraNumber].tem_contrl,
//             cameraNumber
//         );
//     }
// }

  function messageHandler(tem_msg, tem_trg, tem_contrl, today, current_time) {
    console.log('Message Handler Called');
    tem_msg = JSON.parse(tem_msg);

    // Extract relevant information
    const camera = machine_mqtt.camera_id;
    const status = tem_msg.stt.join(', ');// Assuming stt is an array
    const decisionMode = tem_contrl.args.final_decision_mode;
    const connectorModels = Object.values(tem_contrl.args.template_matching);
    const connectorTypes = Object.keys(tem_contrl.args.template_matching);

    // Display received data in the "receivedData" div
    const receivedDataDiv = document.getElementById('receivedData');
    receivedDataDiv.innerHTML = `
      <p>Received Data:</p>
      <p>Message: ${JSON.stringify(tem_msg)}</p>
      <p>Trigger: ${JSON.stringify(tem_trg)}</p>
      <p>Control: ${JSON.stringify(tem_contrl)}</p>
    `;

    // Update the table with stt values
    // updateTable({ camera, status }); // Assuming tem_msg.stt is an array
    updateTable(tem_msg);
    // updateCameraBlock(camera, tem_msg.stt);

    // Update the camera block with STT information
    // updateCameraBlock(cameraNumber, tem_msg.stt);
    // showSTTInformation(tem_msg.stt);
  }
  

  // function addRowToTable(camera, status, totalDetections, totalAnomalies, proc_time) {
  //     const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  //     const newRow = table.insertRow();
  //     const cell1 = newRow.insertCell(0);
  //     const cell2 = newRow.insertCell(1);
  //     const cell3_totalDetections = newRow.insertCell(2);
  //     const cell4_totalAnomalies = newRow.insertCell(3);
  //     const cell5_procTime = newRow.insertCell(4);

  //     // Add data to cells
  //     cell1.innerHTML = camera;
  //     // cell2.innerHTML = status === '6' ? 'Normal' : 'NG'; // Assuming '6' represents normal and other values represent NG
  //     cell2.innerHTML = status === '6' ? 'Normal' : status > '6' ? 'NG' : '';
  //     // cell1.innerHTML = status;

  //      // Convert totalDetections and totalAnomalies to strings before inserting
  //     console.log('Type of totalDetections:', typeof totalDetections);
  //     console.log('Type of totalAnomalies:', typeof totalAnomalies);

  //     cell3_totalDetections.innerHTML = totalDetections.toString(); // Convert to string
  //     cell4_totalAnomalies.innerHTML = totalAnomalies.toString();
  //     cell5_procTime.innerHTML = proc_time;

  //     // Optionally, you can set the column names explicitly
  //     cell1.setAttribute("data-label", "Camera");
  //     cell2.setAttribute("data-label", "Status");
  //     cell3_totalDetections.setAttribute("data-label", "Total Detections");
  //     cell4_totalAnomalies.setAttribute("data-label", "Total Anomalies");
  //     cell5_procTime.setAttribute("data-label", "Proc Time");
  // }

  // function updateTable(tem_msg) {
  //     if (tem_msg && tem_msg.stt && tem_msg.det && tem_msg.proc_time) {
  //         console.log('Received message:', tem_msg);

  //         const selectedCameraParagraph = document.getElementById("selectedCamera");
  //         const selectedCamera = selectedCameraParagraph.textContent.replace("Selected Camera: ", "").trim();

  //         // Construct the camera name
  //         const cameraName = selectedCamera;

  //         const status = tem_msg.stt.join(', ');
  //         console.log('Status:', status);

  //         // // / Parse status and convert it to string
  //         // const statusValues = tem_msg.stt;
  //         // let status = '';
  //         // if (statusValues.includes(6)) {
  //         //     status = 'Normal';
  //         // } else if (Math.max(...statusValues) > 9) {
  //         //     status = 'NG';
  //         // }

  //         // // Parse status and convert it to string
  //         // // const status = tem_msg.stt.join(', ');
  //         // console.log('Status:', status);

  //         // Calculate total detections
  //         let totalDetections = 0;
  //         let totalAnomalies = 0;

  //          // Assuming each value in tem_msg.stt represents a different status
  //         tem_msg.stt.forEach(val => {
  //             if (val === 6) { // Assuming 6 represents a normal status
  //                 totalDetections++; // Increment total detections for each normal status
  //             } else {
  //                 totalAnomalies++; // Increment total anomalies for any other status
  //             }
  //         });

  //         // alert('Total Detections: ' + totalDetections);
  //         // alert('Total Anomalies: ' + totalAnomalies);

  //         console.log('Total Detections:', totalDetections);
  //         console.log('Total Anomalies:', totalAnomalies);

  //         // console.log('Total Detections (type):', typeof totalDetections);
  //         // console.log('Total Anomalies (type):', typeof totalAnomalies);

  //         // Proc Time
  //         const procTime = tem_msg.proc_time;
  //         console.log('Proc Time:', procTime);

  //         console.log('Total Detections before adding row:', totalDetections);
  //         console.log('Total Anomalies before adding row:', totalAnomalies);

  //         // Add data to the table
  //         addRowToTable(cameraName, status, totalDetections, totalAnomalies, procTime);
  //     } else {
  //         console.error('Invalid data structure:', tem_msg);
  //     }
  // }


  function addRowToTable(camera, status, triggerSimilarityValues, proc_time) {
      const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
      const newRow = table.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3_trigger0 = newRow.insertCell(2);
      const cell4_trigger1 = newRow.insertCell(3);
      const cell5_procTime = newRow.insertCell(4);
      const cell6_timestamp = newRow.insertCell(5);

      // Add data to cells
      cell1.innerHTML = camera;
      cell2.innerHTML = status;

      /// Round off trigger similarity values to two decimal points
      const trigger0 = triggerSimilarityValues["0"] !== undefined ? parseFloat(triggerSimilarityValues["0"]).toFixed(2) : 'N/A';
      const trigger1 = triggerSimilarityValues["1"] !== undefined ? parseFloat(triggerSimilarityValues["1"]).toFixed(2) : 'N/A';

      // Trigger Similarity for Trigger 0
      cell3_trigger0.innerHTML = trigger0;

      // Trigger Similarity for Trigger 1
      cell4_trigger1.innerHTML = trigger1;

      // Proc Time
      cell5_procTime.innerHTML = proc_time;

      // Generate current timestamp
      const currentTimestamp = new Date().toLocaleString();

      // Add current timestamp to the cell
      cell6_timestamp.innerHTML = currentTimestamp;

      // Optionally, you can set the column names explicitly
      cell1.setAttribute("data-label", "Camera");
      cell2.setAttribute("data-label", "Status");
      cell3_trigger0.setAttribute("data-label", "Trigger 0");
      cell4_trigger1.setAttribute("data-label", "Trigger 1");
      cell5_procTime.setAttribute("data-label", "Proc Time");
  }

  function updateTable(tem_msg) {
      if (tem_msg && tem_msg.stt && tem_msg.trigger_matching_similarity && tem_msg.proc_time) {
          const selectedCameraParagraph = document.getElementById("selectedCamera");
          const selectedCamera = selectedCameraParagraph.textContent.replace("Selected Camera: ", "").trim();

          // Replace "Camera_" prefix with an empty string to get "Camera_1" as "1"
          const cameraNumber = selectedCamera.replace("Camera_", "");

          // Construct the camera name with the modified number
          const cameraName = "Camera_" + cameraNumber;

          // Calculate status based on the first status value
          const status = convertStatus(tem_msg.stt[0]);

          // Trigger Matching Similarity
          const triggerSimilarityValues = tem_msg.trigger_matching_similarity;

          // Proc Time
          const procTime = tem_msg.proc_time;

          // Timestamp --current time
          // const timestamp = timestamp

          // Add only Camera, Status, Trigger Similarity, and Proc Time to the table
          addRowToTable(cameraName, status, triggerSimilarityValues, procTime);
      } else {
          console.error('Invalid data structure:', tem_msg);
      }
  }

  // Function to convert status
  function convertStatus(statusValue) {
      if (statusValue === 6) {
          return 'Normal';
      } else if (statusValue === 12) {
          return 'NG';
      } else {
          return 'Unknown'; // Handle other cases if necessary
      }
  }



  function hideTable() {
    const dataTableContainer = document.getElementById('dataTableContainer');
    dataTableContainer.classList.add('hidden');
  }

  function showTable() {
    const dataTableContainer = document.getElementById('dataTableContainer');
    dataTableContainer.classList.remove('hidden');
  }

  function clearTable() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
  }

//   function updateCameraBlock(camera, sttInfo) {
//     const cameraBlockId = `camera_${camera}`;
    
//     // Find or create the camera block element
//     let cameraBlock = document.getElementById(cameraBlockId);
//     if (!cameraBlock) {
//         cameraBlock = document.createElement('div');
//         cameraBlock.id = cameraBlockId;
//         document.body.appendChild(cameraBlock);
//     }

//     // Find or create the STT element inside the camera block
//     let sttElement = document.getElementById(`${cameraBlockId}_stt`);
//     if (!sttElement) {
//         sttElement = document.createElement('p');
//         sttElement.id = `${cameraBlockId}_stt`;
//         cameraBlock.appendChild(sttElement);
//     }

//     // Display the STT information
//     sttElement.textContent = `STT for ${camera}: ${JSON.stringify(sttInfo)}`;
// }

//   function updateCameraBlock(camera, sttInfo) {
//       const cameraBlockId = `camera_${camera}`;
      
//       // Find or create the camera block
//       let cameraBlock = document.getElementById(cameraBlockId);
//       if (!cameraBlock) {
//           cameraBlock = document.createElement('div');
//           cameraBlock.id = cameraBlockId;
//           document.body.appendChild(cameraBlock);
//       }

//       // Update the content within the camera block
//       cameraBlock.innerHTML = `
//           <p>Camera ${camera}:</p>
//           <p>STT: ${JSON.stringify(sttInfo)}</p>
//       `;
//   }

// ################################################################################# //  
// ################################# ANALYSIS ###################################### //
// ################################################################################# //


function saveDataFromMessage(parsedMessage) {
  const selectedCameraParagraph = document.getElementById("selectedCamera");
  const selectedCamera = selectedCameraParagraph.textContent.replace("Selected Camera: ", "").trim();

  const status = convertStatus(parsedMessage.stt[0]);

  // Save the received data to the Django server
  saveDataToDatabase(selectedCamera, parsedMessage.stt, parsedMessage.trigger_matching_similarity, parsedMessage.det, parsedMessage.proc_time);
}

  function performAnalysis() {

    clearAnomaliesTable();
    const selectedCameraParagraph = document.getElementById("selectedCamera");
    const selectedCamera = selectedCameraParagraph.textContent.replace("Selected Camera: ", "").trim();

    // Check if a camera is selected
    if (!cameraSelected) {
        alert("Please select a camera before performing analysis.");
        return;
    }

    // Reset the cameraSelected flag
    cameraSelected = false;

    // hideTable()

    machine_mqtt = mqtt_connection();
    if (machine_mqtt) {
        // Use MQTT to extract/catch information from the respective selected camera
        const analysisTopic = `smartfactory/message/${machine_mqtt.machine_id}/#`;
        const analysisPayload = "Requesting analysis data..."; // You can modify the payload as needed

        // Log the analysis topic and payload
        console.log('Analysis Topic:', analysisTopic);
        console.log('Analysis Payload:', analysisPayload);

        // Subscribe to the topic for receiving analysis data
        client.subscribe(analysisTopic);

        // For demonstration purposes, log the analysis request
        console.log(`Subscribed to topic for ${machine_mqtt.machine_id}`);

        // Clear existing rows in the table
        clearTable();

        // Update the receivedData div with some content
        const receivedDataDiv = document.getElementById('receivedData');
        receivedDataDiv.innerHTML = '<p>Data will be displayed here...</p>';

        client.onMessageArrived = function (message) {
          console.log('Received message:', message.payloadString);
          const parsedMessage = JSON.parse(message.payloadString);

          // Save the received data to the Django server
          saveDataToDatabase(selectedCamera, parsedMessage.stt, parsedMessage.trigger_matching_similarity, parsedMessage.det, parsedMessage.proc_time);

          // Convert status
          const status = convertStatus(parsedMessage.stt[0]);

          // Get the current timestamp
          const timestamp = new Date().toLocaleString();

          // Display the table container
          const dataTableContainer = document.getElementById('dataTableContainer');
          dataTableContainer.style.display = 'block';

          addRowToTable(selectedCamera, status, parsedMessage.trigger_matching_similarity, parsedMessage.proc_time, timestamp);
    };
}
}
            // // Calculate total detections and anomalies

            // let totalDetections = 0;
            // let totalAnomalies = 0;

            // parsedMessage.stt.forEach(val => {
            //     if (val === 6) {
            //         totalDetections++;
            //     } else {
            //         totalAnomalies++;
            //     }
            // });



            // Add new row to the table based on the selected camera
            //   addRowToTable(selectedCamera, parsedMessage.stt, parsedMessage.trigger_matching_similarity, parsedMessage.det, parsedMessage.proc_time);
            // addRowToTable(selectedCamera, parsedMessage.stt, totalDetections, totalAnomalies, parsedMessage.proc_time);

  
  function saveDataToDatabase(camera, status, triggerSimilarityValues, detections, procTime) {
    const url = '/save-vitenam-data/';
    const currentDate = new Date();
    const payload = {
        camera: camera,
        status: status.join(', '),  // Assuming stt is an array, join it into a string
        trigger_matching_similarity: triggerSimilarityValues,
        // det: JSON.stringify(detections),
        det: detections,
        proc_time: procTime,
        date: currentDate.toISOString().split('T')[0],  // Extract the date in 'YYYY-MM-DD' format
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }


//         // Set up a callback for when a message is received on the subscribed topic
//         client.onMessageArrived = function (message) {
//           // Process the received message and update the UI
//           console.log('Received message:', message.payloadString);
//           receivedDataDiv.innerHTML = `<p>Received Data: ${message.payloadString}</p>`;
//           const parsedMessage = JSON.parse(message.payloadString);

//           // updateTable(parsedMessage);

//            // Display the table container
//           const dataTableContainer = document.getElementById('dataTableContainer');
//           dataTableContainer.style.display = 'block';

//           // Add new row to the table based on the selected camera
//           addRowToTable(selectedCamera, parsedMessage.stt, parsedMessage.trigger_matching_similarity);
//     };
//   }
// }


// Call the initial function to start the process
  startConnect(() => {
      // You might want to perform other actions after the connection is established
      console.log('MQTT client connected. Ready to perform analysis.');
      // Call performAnalysis once the connection is established
      // performAnalysis();
  });


// ################################################################################# //  
// ################################# REMOTE ACCESS ################################# //
// ################################################################################# //

  const remoteLinks = [
    // vitenam
    'https://100.98.198.86:8445/',
  
    ];

  function provideRemoteAccess() {
    const selectedCameraIndex = getSelectedCameraIndex();

    if (selectedCameraIndex !== -1 && selectedCameraIndex < remoteLinks.length) {
      const remoteLink = remoteLinks[selectedCameraIndex];
      window.open(remoteLink, '_blank');
      } 
      else {
        console.log('No camera selected or invalid index.');
          }
      clearTotalsTable();
    }

  function getSelectedCameraIndex() {
    const selectedCamera = document.getElementById("selectedCamera").textContent;
    const match = selectedCamera.match(/\d+/); // Extracts the camera index from the selectedCamera text
    return match ? parseInt(match[0]) - 1: -1; // Returns the camera index as a number
    }

//   const cameraList = document.getElementById("cameraList");
//   cameraList.style.display = "block";
//   hideButtons(); // Hide buttons when toggling camera list
// });


//   function createCameraBlock(cameraName) {
//     const cameraBlockId = `camera_${cameraName}`;
//     const cameraBlock = document.createElement('div');
//     cameraBlock.id = cameraBlockId;

//     // Create a span for camera actions
//     const cameraActions = document.createElement('span');

//     // Add icons for adding, changing, and deleting cameras
//     const addIcon = document.createElement('i');
//     addIcon.className = 'fa fa-plus';
//     addIcon.title = 'Add Camera';
//     addIcon.addEventListener('click', () => addCamera(cameraName));
//     cameraActions.appendChild(addIcon);

//     const changeIcon = document.createElement('i');
//     changeIcon.className = 'fa fa-edit';
//     changeIcon.title = 'Change Camera Name';
//     changeIcon.addEventListener('click', () => changeCamera(cameraName));
//     cameraActions.appendChild(changeIcon);

//     const deleteIcon = document.createElement('i');
//     deleteIcon.className = 'fa fa-trash';
//     deleteIcon.title = 'Delete Camera';
//     deleteIcon.addEventListener('click', () => deleteCamera(cameraName));
//     cameraActions.appendChild(deleteIcon);

//     // Append camera actions to the camera block
//     cameraBlock.appendChild(cameraActions);

//     // Other content or styling for the camera block can be added here

//     // Append the camera block to the document body or a container element
//     document.body.appendChild(cameraBlock);
// }

  // function addCamera() {
  //   const newCameraName = prompt('Enter the name for the new camera:');
  //   if (newCameraName) {
  //     // Perform the logic to add the new camera (e.g., update the database)
  //     // Optionally, you can refresh the camera list or take other actions
  //     console.log('Adding new camera:', newCameraName);
  //   }
  // }

  // function changeCamera() {
  //   const newCameraName = prompt('Enter the new name for the selected camera:');
  //   if (newCameraName) {
  //     // Perform the logic to change the selected camera (e.g., update the database)
  //     // Optionally, you can refresh the camera list or take other actions
  //     console.log('Changing camera name to:', newCameraName);
  //   }
  // }

  // function deleteCamera() {
  //   const confirmation = confirm('Are you sure you want to delete the selected camera?');
  //   if (confirmation) {
  //     // Perform the logic to delete the selected camera (e.g., update the database)
  //     // Optionally, you can refresh the camera list or take other actions
  //     console.log('Deleting selected camera');
  //   }
  // }

  // function createCameraBlock(cameraName) {
  //   const cameraBlocksContainer = document.getElementById('cameraBlocksContainer');
  //   const cameraBlock = document.createElement('div');
  //   cameraBlock.id = `cameraBlock_${cameraName}`;
  //   cameraBlock.className = 'camera-block';

  //   // Display the camera name
  //   const cameraNameElement = document.createElement('p');
  //   cameraNameElement.textContent = `Camera ${cameraName}`;

  //   // Add icons for actions
  //   const addActionIcon = createIcon('fas fa-plus-circle', 'addCamera', cameraName);
  //   const changeActionIcon = createIcon('fas fa-edit', 'changeCamera', cameraName);
  //   const deleteActionIcon = createIcon('fas fa-trash', 'deleteCamera', cameraName);

  //   // Append elements to the camera block
  //   cameraBlock.appendChild(cameraNameElement);
  //   cameraBlock.appendChild(addActionIcon);
  //   cameraBlock.appendChild(changeActionIcon);
  //   cameraBlock.appendChild(deleteActionIcon);

  //   // Append the camera block to the container
  //   cameraBlocksContainer.appendChild(cameraBlock);
  // }

  // function createIcon(iconClass, action, cameraName) {
  //   const icon = document.createElement('i');
  //   icon.className = `action-icon ${iconClass}`;
  //   icon.onclick = function () {
  //     handleAction(action, cameraName);
  //   };
  //   return icon;
  // }

  // function handleAction(action, cameraName) {
  //   switch (action) {
  //     case 'addCamera':
  //       addCamera(cameraName);
  //       break;
  //     case 'changeCamera':
  //       changeCamera(cameraName);
  //       break;
  //     case 'deleteCamera':
  //       deleteCamera(cameraName);
  //       break;
  //     // Add more actions as needed
  //   }
  // }

  // function addCamera(cameraName) {
  //   // Add logic for adding a camera
  //   console.log(`Adding camera: ${cameraName}`);
  // }

  // function changeCamera(cameraName) {
  //   // Add logic for changing a camera
  //   console.log(`Changing camera: ${cameraName}`);
  // }

  // function deleteCamera(cameraName) {
  //   // Add logic for deleting a camera
  //   console.log(`Deleting camera: ${cameraName}`);
  // }

  // Save the received data to the Django server
  