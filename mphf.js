<html>
<head>
<title> (Key, Value) Minimal Perfect Hashing Demo -- Throw the Keys! in Javascript </title>
<script>

   var dict1 = { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6,
                "g": 7, "h": 8, "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15
                };

   function randChar(size) {
     var result = '';
     while(size > 0) {
       result += String.fromCharCode( Math.floor(Math.random() * 94) + 32 );
       size--;
     }
     return result;
   }

   function randomHash(size) {
     var result = {};
     var i = 0;
     while(i < size) {
       result[ randChar(10) ] = i;
       i++;
     }
     return result;
   };

   var dict = randomHash(15);

   function hash( d, str) {
     if(d == 0) { d = 0x811c9dc5; }
     for(var i = 0; i < str.length; i++) {
       // multiply by the 32 bit FNV magic prime mod 2^32
       d += (d << 1) + (d << 4) + (d << 7) + (d << 8) + (d << 24);
       // xor the bottom with the current octet
       d ^= str.charCodeAt(i);
     }
     return d & 0x7fffffff;
}

// Look up a value in the hash table, defined by G and V.
function lookup(key) {
  var d = G[ hash(0,key) % G.length ];
  if (d < 0) return V[ 0-d-1 ];
  return V[hash(d, key) % V.length];
};

    document.writeln("<h2>Generating MPHF </h2><br/>");
    //documet.writeln(" for the keyset in Javascript");
    document.writeln("For an Interactive Perfect Hashing Demo: <a href='http://iswsa.acm.org/mphf/openDSAPerfectHashAnimation/perfectHashAV.html'>MPHF Interactive Demo</a>");
    document.writeln("<br/><br/><h3>Elements ( Reload the page for different  random key set): </h3><br/>");
    document.write("<table border=2><tr><th> Element </th><th> Value </th></tr>");
    for (var elem in dict) {
     if (dict.hasOwnProperty(elem)) {
       document.write("<tr><td>" + elem + "</td><td>" + dict[elem]+"</td></tr>");
     }
    }
    document.writeln("</table><br/><br/>");
    document.writeln("Dictionary Size:"+ Object.keys(dict).length);
    document.writeln("<br/>");
    //tables =
 //document.write("in create");

  var size = Object.keys(dict).length;
  //document.write(size);
  var buckets = [];
  var G = new Array(size);
  var values = new Array(size);
  var i, b, bucket;

  // Place all of the keys into buckets
  //document.write("mapping");
  //document.writeln("<br/>");
  Object.keys(dict).forEach(function(key) {
      var bkey = hash(0, key) % size;
      //document.writeln(bkey+"<br/>");
      if(!buckets[bkey]) {
        buckets[bkey] = [];
      }
      buckets[bkey].push( key );
  });

  // Computes a minimal perfect hash table using the given Javascript object hash. It
  // returns a tuple (G, V). G and V are both arrays. G contains the intermediate
  // table of values needed to compute the index of the value in V. V contains the
  // values of the dictionary.



    // Sort the buckets and process the ones with the most items first.
    buckets.sort(function(a, b) { return b.length - a.length; });

    for(b = 0; b < size; b++) {
      if(buckets[b].length <= 1) break;
      bucket = buckets[b];

      var d = 1, item = 0, slots = [], slot, used = {};

      // Repeatedly try different values of d until we find a hash function
      // that places all items in the bucket into free slots
      while(item < bucket.length) {
        slot = hash(d, bucket[item]) % size;
        if(values[slot] || used[slot]) {
          d++;
          item = 0;
          slots = [];
          used = {};
        } else {
          used[slot] = true;
          slots.push(slot);
          item++;
        }
      }

      G[hash(0, bucket[0]) % size] = d;
      for(i = 0; i < bucket.length; i++) {
        values[slots[i]] = dict[bucket[i]];
      }
    }

    // Only buckets with 1 item remain. Process them more quickly by directly
    // placing them into a free slot. Use a negative value of d to indicate
    // this.

    var freelist = [];
    for(i = 0; i < size; i++) {
      if(typeof values[i] == 'undefined' ) {
        freelist.push(i);
      }
    }

    for(; b < size; b++ ) {
      if (!buckets[b] || buckets[b].length == 0) break;
      bucket = buckets[b];
      slot = freelist.pop();

      // We subtract one to ensure its negative even if the zeroeth slot was used.
      G[hash(0, bucket[0]) % size] = 0-slot-1;
      values[slot] = dict[bucket[0]];
    }


     document.write("<br/><br/>MPHF Creation Succeeded: G Array Size = "+size);
     document.write("<br/><br/>The G Array defined Elements: "+Object.keys(G).length+"<br/><br/>");
     document.write("<br/>The G Array<br/>");
	     for (var elem in G) {
	 	     //if (G.hasOwnProperty(elem)) {
	 	       document.write("elem: " + elem + " value: " + G[elem]+"<br/>");
	 	     //}
	 	    }
	 	//    document.writeln("<br/>");
	 	//    document.writeln(Object.keys(G).length);
    //document.writeln("<br/>");

     document.write("<br/><br/>MPHF Verification for all elements: <br/><br/>");
    //document.write(tables);
    document.write("<table border=2><tr><th>Key</th><th>Value</th></tr>");
    Object.keys(dict).forEach(function(key) {
        //document.write(key+"<br/>");
        var d = G[ hash(0,key) % G.length ];
        //document.write(d+"<br/>");
	    if (d < 0)
	     document.write("<tr><td>" + key + "</td><td>"+  values[ 0-d-1 ]+"</td></tr>");
	    else
	     document.write("<tr><td>" + key + "</td><td>"+  values[hash(d, key) % values.length]+"</td></tr>");


    });
    document.writeln("</table>");
</script>
</head>
<body>


</body>
</html>
