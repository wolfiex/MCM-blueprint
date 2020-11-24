function dataURIToBlob( dataURI ) {
  const binStr = window.atob( dataURI.split( ',' )[1] );
  const len = binStr.length;
  const arr = new Uint8Array( len );
  for ( let i = 0; i < len; i++ ) {
    arr[i] = binStr.charCodeAt( i );
  }
  return new window.Blob( [arr] );
}

function saveDataURI( name, dataURI ) {
  const blob = dataURIToBlob( dataURI );

  // force download
  const link = document.createElement( 'a' );
  link.download = name;
  link.href = window.URL.createObjectURL( blob );
  link.onclick = () => {
    window.setTimeout( () => {
      window.URL.revokeObjectURL( blob );
      link.removeAttribute( 'href' );
  }, 25000 );

  };
  link.click();
}

function defaultFileName (ext) {
  const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
  return str.replace(/\//g, '-').replace(/:/g, '.');
}


window.ts = function takeScreenshot( width, height ) {
  
    // set camera and renderer to desired screenshot dimension
    window.c.aspect = width / height;
    window.c.updateProjectionMatrix();
    window.r.setSize(  width, height );
  
    window.r.render( window.s, window.c, null, false );

    const DataURI = window.r.domElement.toDataURL( 'image/png' );

    // save
    saveDataURI(defaultFileName( '.png' ), DataURI);

    // reset to old dimensions by invoking the on window resize function
    onWindowResize();
  
 }
 
 
 window.current = function(){window.ts(window.innerWidth, window.innerHeight)}
 
 function onWindowResize() {
   window.c.aspect = window.innerWidth / window.innerHeight;
   window.c.updateProjectionMatrix();

   window.r.setSize(window.innerWidth, window.innerHeight);
 }
 
 document.getElementById('container').addEventListener('doubleclick',function(x){window.current()})
 
 console.log(window.c,'mod')