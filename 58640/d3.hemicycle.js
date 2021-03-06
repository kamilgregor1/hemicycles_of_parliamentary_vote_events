d3.hemicycle = function() {
  function hemicycle(selection) {
    selection.each(function(d, i) {
    // options
    var nvar = (typeof(n) === "function" ? n(d) : n),
        gapvar = (typeof(gap) === "function" ? gap(d) : gap),
        widthIconvar = (typeof(widthIcon) === "function" ? widthIcon(d) : widthIcon),
        widthvar =  (typeof(width) === "function" ? width(d) : width);
        peoplevar =  (typeof(people) === "function" ? people(d) : people);
        
    var rmax = 1 + nvar.length *gapvar*widthIconvar;
    
    var xScale = d3.scale.linear()
	      .domain([-1*rmax, rmax])
	      .range([0, widthvar]),
	    xxScale = d3.scale.linear()
	      .domain([0, 2*rmax])
	      .range([0, widthvar])
        yScale = d3.scale.linear()
          .domain([0, rmax])
          .range([widthvar/2,0]);
   
    var data = [],
        s = [];
    for (i in nvar) {
      s.push((Math.PI/widthIconvar + Math.PI*i*gapvar-nvar[i])/(nvar[i] - 1));
      var ninrow = nvar[i],
          radwidth = Math.PI/(nvar[i]+(nvar[i]-1)*s[i]),
          radspace = radwidth*s[i],
          r = 1 + i*gapvar*widthIconvar;
      for (j=0;j<ninrow;j++) {
        var x = Math.cos(radwidth*(0.5+j)+j*radspace)*r,
            y = Math.sin(radwidth*(0.5+j)+j*radspace)*r,
            rot = -1*(radwidth*(0.5+j)+j*radspace)/Math.PI*180+90;
        data.push({'x':x,'y':y,'rot':rot});
      }
    }
    
    data.sort(function(x,y) {
      if (x['rot'] < y['rot']) return -1;
      if (x['rot'] > y['rot']) return 1;
      return 0
    });
    
    var i = 0;
      //for (j=0;j<group['n'];j++) {
    for (key in peoplevar) {
        person = peoplevar[key];
        for (var attrname in person) { data[i][attrname] = person[attrname]; }
        //data[i]['color'] = group['color'];
        //data[i]['name'] = //group['name'];
        data[i]['widthIcon'] = widthIconvar;
        if (parseInt(person["option_code"]) == -1) data[i]['background'] = "red";
        if (parseInt(person["option_code"]) == 0) data[i]['background'] = "gray";
        if (parseInt(person["option_code"]) == 1) data[i]['background'] = "green";
        i++;
    }

    
    /*var angle = [{'startangle':0,'endangle':Math.PI/2}];

    var arci = d3.svg.arc()
                    .startAngle(function(d){return d.startangle})
                    .endAngle(function(d){return d.endangle})
                    .outerRadius(x0Scale(rmax))
                    .innerRadius(0);

    var position = [xScale(0),yScale(0)];*/
    
    var element = d3.select(this);
    
    var icons = element.selectAll(".icon")
		    .data(data)
          .enter().append("a")
            .attr("transform",function(d) {return "rotate("+d.rot+","+xScale(d.x)+","+yScale(d.y)+")"})
            .attr("xlink:href",function(d) {return d.link})
            .on("mouseover", tip.show)
	        .on("mouseout", tip.hide)
            ;
    
    //http://stackoverflow.com/questions/13203897/d3-nested-appends-and-data-flow      
        icons.append("text")
              .attr('font-size',xxScale(
                d.widthIcon*1.15/2))
              .attr('font-family', 'FontAwesome')
               .attr('x',function(d) {return xScale(d.x+d.widthIcon/2.8);})
               .attr('y',function(d) {return yScale(d.y+d.widthIcon/2.8);}) 
               .attr('fill',function(d) {return d.background}) 
               .attr('fill-opacity', function(d) {
                  if (Math.abs(parseInt(d.option_code)) == 1) return 1;
                  else return 0.25;
                })
               .attr('text-anchor',"middle")
               //.text('\uf005');
              .text(function(d) {if (d.background == 'red') return '\uf0a3'; else return '\uf0a3';});
    
    icons.append("text")
            .attr('font-family', 'FontAwesome')
            .attr('font-size',xxScale(
            d.widthIcon*1.15)) //the icon is about 1.15times higher then wide
            .attr('fill', function(d) {
              return d.color;
            })
            .attr('fill-opacity', function(d) {
              if (Math.abs(parseInt(d.option_code)) == 1) return 1;
              else return 0.25;
            })
            .attr('stroke-width', function(d) {return 1;})
            .attr('stroke-opacity',function(d) {
              if (Math.abs(parseInt(d.option_code)) == 1) return 0.9;
              else return 0.25;
            })
            .attr('text-anchor',"middle")
            .attr('class', 'shadow')
            .attr('x',function(d) {return xScale(d.x);})
            .attr('y',function(d) {return yScale(d.y);})          
            .text('\uf007');

  });
  }
  
    hemicycle.n = function(value) {
        if (!arguments.length) return value;
        n = value;
        return hemicycle;
    };
    hemicycle.gap = function(value) {
        if (!arguments.length) return value;
        gap = value;
        return hemicycle;
    }; 
    hemicycle.widthIcon = function(value) {
        if (!arguments.length) return value;
        widthIcon = value;
        return hemicycle;
    };
    hemicycle.width = function(value) {
        if (!arguments.length) return value;
        width = value;
        return hemicycle;
    };
    hemicycle.people = function(value) {
        if (!arguments.length) return value;
        people = value;
        return hemicycle;
    };

  return hemicycle;
}
