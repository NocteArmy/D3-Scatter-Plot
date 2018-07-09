document.addEventListener('DOMContentLoaded', () => {
  req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
  req.send();
  req.onload = function() {
    const dataset = JSON.parse(req.responseText);
    const w = 1000;
    const h = 600;
    const padding = 100;
    
    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d.Year - 1), d3.max(dataset, (d) => d.Year + 1)])
                     .range([padding, w - padding]);
    
    const parseTime = d3.timeParse('%M:%S');
    const yScale = d3.scaleTime()
                     .domain([d3.min(dataset, (d) => parseTime(d.Time)), d3.max(dataset, (d) => parseTime(d.Time))])
                     .range([h - padding, padding]);
    
    const tooltip = d3.tip()
                      .attr('id', 'tooltip')
                      .offset([0, 0])
                      .html((d, i) => {
                        tooltip.attr('data-year', d.Year)
                        let str = d.Name + ': ' + d.Nationality + '<br>Year: ' + d.Year + ', Time: ' + d.Time;
                        if(d.Doping !== '') str += '<br><br>' + d.Doping;
                        return str;
                      });
    
    const svg = d3.select('body')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)
                  .call(tooltip);
    
    d3.select('svg').append('text').text('Doping in Professional Bicyle Racing').attr('id', 'title').attr('x', 230).attr('y', 45);
    d3.select('svg').append('text').text('35 fastest times up Alpe d\'Huez').attr('id', 'sub-title').attr('x', 350).attr('y', 70);
    
    d3.select('svg').append('text').text('Time (Min:Sec)').attr('transform', 'translate(45, 350)rotate(-90)');
    
    d3.select('svg').append('text').text('Legend').attr('id', 'legend').attr('transform', 'translate(700, 425)');
    d3.select('svg').append('circle').attr('r', 6).attr('transform', 'translate(706, 446)').style('fill', 'orange').attr('class', 'legend-dot');
    d3.select('svg').append('text').text('No doping allegations').attr('transform', 'translate(716, 450)');
    d3.select('svg').append('circle').attr('r', 6).attr('transform', 'translate(706, 471)').style('fill', '#0066ff').attr('class', 'legend-dot');
    d3.select('svg').append('text').text('Riders with doping allegations').attr('transform', 'translate(716, 475)');
    
    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('cx', (d, i) => xScale(d.Year))
       .attr('data-xvalue', (d, i) => d.Year)
       .attr('cy', (d, i) => yScale(parseTime(d.Time)))
       .attr('data-yvalue', (d, i) => parseTime(d.Time))
       .attr('r', 6)
       .attr('class', 'dot')
       .style('fill', (d) => d.Doping !== "" ? '#0066ff' : 'orange')
       .on('mouseover', tooltip.show)
       .on('mouseout', tooltip.hide);
    
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.0f'));
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickFormat(d3.timeFormat('%M:%S'));
    
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (h - padding) + ')')
       .call(xAxis);
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
  }
});