        let offset = 1;
        let limit = 20;

       

        async function fetchData(offset, limit) {
            document.getElementById('loadMore').innerHTML = 'Loading...';
          const apiUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit='+limit+'&offset='+offset;

          try {
            const response = await fetch(apiUrl);
            if(!response.type){
              throw new Error('Missing Api DATA');
            }
            const data = await response.json();
            document.getElementById('loadMore').innerHTML = 'Load More';
            return data;
          } catch(error) {
            console.error('Error fetching data:', error);
          }
        }

        async function displayData(offset, limit) {
          const dataList = document.getElementById('data-list');
          const data = await fetchData(offset, limit);
     

          data.features.forEach(element => {
            let boja = 'success';
            let location = element.properties.place;
            if(!location) {
              location = '*Missing location details';
            }
            const magnitude = parseFloat(element.properties.mag);

            if(magnitude > 3) {
              boja = 'warning';
            } 
            if (magnitude >= 5) {
              boja = 'danger';
            }
            const eartDate = new Date(element.properties.time);
            var datetime = eartDate.getDate() + "."
                + (eartDate.getMonth()+1)  + "." 
                + eartDate.getFullYear() + " @ "  
                + eartDate.getHours() + ":"  
                + eartDate.getMinutes() + ":" 
                + eartDate.getSeconds();
            const link = "https://www.google.com/maps/place/"+ element.geometry.coordinates[1] +"+"+ element.geometry.coordinates[0] +"/@"+ element.geometry.coordinates[1] +","+ element.geometry.coordinates[0] +",11.37z/";
            const earthquake = '<div class="col-md-12">' +
              '<div class="alert alert-'+ boja +' m-1" role="alert">' +
                '<div class="row">' +
                  '<div class="col-2 text-center">' +
                    '<span class="magnitude">' + element.properties.mag.toFixed(1)  +'</span>' +
                    '</div>' +
                    '<div class="col-8 text-left">' +
                      '<div class="erq-time">' + datetime +
                        '</div>' +
                        '<div class="erq-location">' + location +
                          '</div>' +
                          '<div class="erq=time">'+ element.geometry.coordinates[2].toFixed(2) +' km depth</div>' +
                          '</div>' +
                          '<div class="col-2"><a class="map-link" href='+link+' target="_blank"><i class="bi bi-geo-alt-fill"></i></a></div>'
                          '</div>' +
                          '</div>';

                          dataList.innerHTML += earthquake;
          })
        }

        const loadMoreBtn = document.getElementById('loadMore');
        loadMoreBtn.addEventListener('click', function(){
          let newOffest = limit + 1;
          limit = limit + 20;
          displayData(newOffest, 20);
        });

        displayData(offset, limit);