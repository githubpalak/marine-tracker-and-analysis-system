import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marine-tracker-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ``,
  styleUrls: ['./marine-tracker-home.component.scss']
})
export class MarineTrackerHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('oceanCanvas') oceanCanvas!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('routeChart') routeChart!: ElementRef;
  @ViewChild('fuelChart') fuelChart!: ElementRef;
  @ViewChild('weatherChart') weatherChart!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initOceanAnimation();
    this.initMapVisualization();
    this.initCharts();
    this.initVesselAnimations();
  }

  private initOceanAnimation(): void {
    const canvas = this.oceanCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const waves = {
      y: canvas.height / 2,
      length: 0.01,
      amplitude: 20,
      frequency: 0.02
    };
    
    // Create gradient for ocean
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(25, 145, 235, 0.7)');
    gradient.addColorStop(0.5, 'rgba(38, 95, 160, 0.8)');
    gradient.addColorStop(1, 'rgba(10, 30, 90, 0.9)');
    
    let increment = 0;
    
    // Animation function
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * waves.length + increment) * waves.amplitude + waves.y;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      increment += waves.frequency;
      
      requestAnimationFrame(renderWave);
    };
    
    renderWave();
  }

  private initMapVisualization(): void {
    const mapElement = this.mapContainer.nativeElement;
    
    // Create world map visualization with SVG or Canvas
    // This is a placeholder - in a real app you'd use a mapping library
    // like Leaflet or Google Maps API
    
    // For demo purposes, we'll create a simple world map representation
    const mapSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mapSvg.setAttribute("viewBox", "0 0 1000 500");
    mapSvg.style.width = "100%";
    mapSvg.style.height = "100%";
    
    // Simple world map path (rough approximation)
    const worldPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    worldPath.setAttribute("d", "M150,100 Q400,50 650,100 T950,150 Q800,250 950,350 T650,400 Q400,450 150,400 T50,350 Q200,250 50,150 T150,100Z");
    worldPath.setAttribute("fill", "#2a4b8d");
    worldPath.setAttribute("stroke", "#3a6cbd");
    worldPath.setAttribute("stroke-width", "2");
    
    mapSvg.appendChild(worldPath);
    
    // Add vessel dots
    const vesselPositions = [
      {x: 250, y: 150},
      {x: 400, y: 200},
      {x: 600, y: 250},
      {x: 300, y: 300},
      {x: 700, y: 180},
      {x: 550, y: 350},
      {x: 800, y: 220}
    ];
    
    vesselPositions.forEach(pos => {
      const vessel = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      vessel.setAttribute("cx", pos.x.toString());
      vessel.setAttribute("cy", pos.y.toString());
      vessel.setAttribute("r", "5");
      vessel.setAttribute("fill", "#ff9900");
      vessel.classList.add("map-vessel");
      
      // Animate vessels
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "r");
      animate.setAttribute("values", "5;7;5");
      animate.setAttribute("dur", "3s");
      animate.setAttribute("repeatCount", "indefinite");
      
      vessel.appendChild(animate);
      mapSvg.appendChild(vessel);
      
      // Add route paths
      if (Math.random() > 0.5) {
        const route = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const endX = pos.x + Math.random() * 100 - 50;
        const endY = pos.y + Math.random() * 100 - 50;
        route.setAttribute("d", `M${pos.x},${pos.y} Q${(pos.x + endX) / 2 + 20},${(pos.y + endY) / 2 - 20} ${endX},${endY}`);
        route.setAttribute("stroke", "#ff9900");
        route.setAttribute("stroke-width", "1.5");
        route.setAttribute("stroke-dasharray", "5,3");
        route.setAttribute("fill", "none");
        mapSvg.appendChild(route);
      }
    });
    
    mapElement.appendChild(mapSvg);
  }

  private initCharts(): void {
    // Initialize route optimization chart
    if (this.routeChart) {
      const chart = this.createPieChart(this.routeChart.nativeElement, [
        { label: 'Optimized', value: 65, color: '#4CAF50' },
        { label: 'Standard', value: 25, color: '#2196F3' },
        { label: 'Pending', value: 10, color: '#FFC107' }
      ]);
    }
    
    // Initialize fuel efficiency chart
    if (this.fuelChart) {
      const data = [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 59 },
        { month: 'Mar', value: 80 },
        { month: 'Apr', value: 72 },
        { month: 'May', value: 78 },
        { month: 'Jun', value: 85 }
      ];
      this.createBarChart(this.fuelChart.nativeElement, data);
    }
    
    // Initialize weather impact chart
    if (this.weatherChart) {
      const data = [
        { label: 'Clear', value: 15 },
        { label: 'Moderate', value: 40 },
        { label: 'Rough', value: 30 },
        { label: 'Severe', value: 15 }
      ];
      this.createDonutChart(this.weatherChart.nativeElement, data);
    }
  }

  private createPieChart(element: HTMLElement, data: any[]): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.style.width = "100%";
    svg.style.height = "100%";
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 40;
    const centerX = 50;
    const centerY = 50;
    
    // Create chart legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    
    data.forEach((item, index) => {
      // Calculate slice angles
      const angle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate paths
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      // Create path
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`);
      path.setAttribute("fill", item.color);
      path.setAttribute("stroke", "#fff");
      path.setAttribute("stroke-width", "1");
      
      // Add animation
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "opacity");
      animate.setAttribute("from", "0");
      animate.setAttribute("to", "1");
      animate.setAttribute("dur", "0.8s");
      animate.setAttribute("begin", `${index * 0.2}s`);
      animate.setAttribute("fill", "freeze");
      
      path.appendChild(animate);
      svg.appendChild(path);
      
      // Add to legend
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
        <span class="legend-color" style="background-color: ${item.color}"></span>
        <span class="legend-label">${item.label}: ${item.value}%</span>
      `;
      
      legend.appendChild(legendItem);
      
      startAngle = endAngle;
    });
    
    element.appendChild(svg);
    element.appendChild(legend);
  }
  
  private createBarChart(element: HTMLElement, data: any[]): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 60");
    svg.style.width = "100%";
    svg.style.height = "100%";
    
    const chartWidth = 90;
    const chartHeight = 40;
    const barWidth = chartWidth / data.length - 2;
    const maxValue = Math.max(...data.map(item => item.value));
    
    // Create axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "5");
    xAxis.setAttribute("y1", "45");
    xAxis.setAttribute("x2", "95");
    xAxis.setAttribute("y2", "45");
    xAxis.setAttribute("stroke", "#999");
    xAxis.setAttribute("stroke-width", "1");
    
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "5");
    yAxis.setAttribute("y1", "5");
    yAxis.setAttribute("x2", "5");
    yAxis.setAttribute("y2", "45");
    yAxis.setAttribute("stroke", "#999");
    yAxis.setAttribute("stroke-width", "1");
    
    svg.appendChild(xAxis);
    svg.appendChild(yAxis);
    
    // Create bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = 8 + index * (barWidth + 2);
      const y = 45 - barHeight;
      
      const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bar.setAttribute("x", x.toString());
      bar.setAttribute("y", y.toString());
      bar.setAttribute("width", barWidth.toString());
      bar.setAttribute("height", "0");
      bar.setAttribute("fill", "#2196F3");
      bar.setAttribute("rx", "2");
      
      // Add animation
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "height");
      animate.setAttribute("from", "0");
      animate.setAttribute("to", barHeight.toString());
      animate.setAttribute("dur", "0.8s");
      animate.setAttribute("begin", `${index * 0.1}s`);
      animate.setAttribute("fill", "freeze");
      
      const animateY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animateY.setAttribute("attributeName", "y");
      animateY.setAttribute("from", "45");
      animateY.setAttribute("to", y.toString());
      animateY.setAttribute("dur", "0.8s");
      animateY.setAttribute("begin", `${index * 0.1}s`);
      animateY.setAttribute("fill", "freeze");
      
      bar.appendChild(animate);
      bar.appendChild(animateY);
      
      // Add label
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", (x + barWidth/2).toString());
      label.setAttribute("y", "50");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "3");
      label.setAttribute("fill", "#666");
      label.textContent = item.month;
      
      // Add value
      const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
      value.setAttribute("x", (x + barWidth/2).toString());
      value.setAttribute("y", (y - 2).toString());
      value.setAttribute("text-anchor", "middle");
      value.setAttribute("font-size", "3");
      value.setAttribute("fill", "#333");
      value.textContent = item.value.toString();
      
      svg.appendChild(bar);
      svg.appendChild(label);
      svg.appendChild(value);
    });
    
    element.appendChild(svg);
  }
  
  private createDonutChart(element: HTMLElement, data: any[]): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.style.width = "100%";
    svg.style.height = "100%";
    
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const outerRadius = 40;
    const innerRadius = 25;
    const centerX = 50;
    const centerY = 50;
    
    // Color palette
    const colors = ['#FFC107', '#FF9800', '#F44336', '#673AB7'];
    
    // Create chart legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    
    // Create center text with total
    const totalText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    totalText.setAttribute("x", centerX.toString());
    totalText.setAttribute("y", (centerY + 2).toString());
    totalText.setAttribute("text-anchor", "middle");
    totalText.setAttribute("font-size", "10");
    totalText.setAttribute("font-weight", "bold");
    totalText.setAttribute("fill", "#333");
    totalText.textContent = total.toString();
    
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", centerX.toString());
    labelText.setAttribute("y", (centerY + 8).toString());
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "4");
    labelText.setAttribute("fill", "#666");
    labelText.textContent = "Total";
    
    data.forEach((item, index) => {
      // Calculate slice angles
      const angle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate outer arc paths
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      
      // Calculate inner arc paths
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      // Create donut segment path
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${x1},${y1} A${outerRadius},${outerRadius} 0 ${largeArcFlag},1 ${x2},${y2} L${x3},${y3} A${innerRadius},${innerRadius} 0 ${largeArcFlag},0 ${x4},${y4} Z`);
      path.setAttribute("fill", colors[index % colors.length]);
      path.setAttribute("stroke", "#fff");
      path.setAttribute("stroke-width", "0.5");
      
      // Add animation
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "opacity");
      animate.setAttribute("from", "0");
      animate.setAttribute("to", "1");
      animate.setAttribute("dur", "0.8s");
      animate.setAttribute("begin", `${index * 0.2}s`);
      animate.setAttribute("fill", "freeze");
      
      path.appendChild(animate);
      svg.appendChild(path);
      
      // Add to legend
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
        <span class="legend-color" style="background-color: ${colors[index % colors.length]}"></span>
        <span class="legend-label">${item.label}: ${item.value}%</span>
      `;
      
      legend.appendChild(legendItem);
      
      startAngle = endAngle;
    });
    
    svg.appendChild(totalText);
    svg.appendChild(labelText);
    element.appendChild(svg);
    element.appendChild(legend);
  }

  private initVesselAnimations(): void {
    // Add vessel animations
    const vesselElements = document.querySelectorAll('.vessel');
    
    vesselElements.forEach((vessel: Element, index) => {
      // Create custom animation for each vessel
      const vesselElement = vessel as HTMLElement;
      
      // Random starting position
      const startX = 20 + Math.random() * 60;
      const startY = 20 + Math.random() * 60;
      
      vesselElement.style.left = `${startX}%`;
      vesselElement.style.top = `${startY}%`;
      
      // Create animation
      const animateVessel = () => {
        const duration = 15000 + Math.random() * 10000; // 15-25 seconds
        const targetX = 20 + Math.random() * 60;
        const targetY = 20 + Math.random() * 60;
        
        vesselElement.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
        vesselElement.style.left = `${targetX}%`;
        vesselElement.style.top = `${targetY}%`;
        
        // Schedule next animation
        setTimeout(animateVessel, duration);
      };
      
      // Start with delay based on index
      setTimeout(animateVessel, index * 2000);
    });
  }
}