import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface CalculatorItem {
  name: string;
  price: number;
  icon?: string;
}

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator-page.html',
  styleUrl: './calculator-page.scss',
})
export class CalculatorPage {
  categories: Category[] = [
    { name: 'Uñas', icon: '💅', color: '#ec2f86' },
    { name: 'Cabello', icon: '💇‍♀️', color: '#7b3fc8' },
    { name: 'Lashismo', icon: '👁️', color: '#b88945' },
    { name: 'Cejas', icon: '🌿', color: '#35a853' },
    { name: 'Facial', icon: '🧖‍♀️', color: '#3498db' },
    { name: 'Otros', icon: '✨', color: '#f39c12' },
  ];

  activeCategory = this.categories[0];

  tabs = ['Técnica', 'Extras', 'Cristales', 'Otros'];
  activeTab = 'Técnica';

  items: CalculatorItem[] = [
    { name: 'Acrílico', price: 20 },
    { name: 'Soft Gel', price: 18 },
    { name: 'Polygel', price: 17 },
    { name: 'Semipermanente', price: 12 },
    { name: 'Baño Acrílico', price: 15 },
    { name: 'Gel Constructor', price: 13 },
  ];

  extras: CalculatorItem[] = [
    { name: 'Retiro', price: 3, icon: '🌸' },
    { name: 'Reposición', price: 2, icon: '💧' },
    { name: 'Francés', price: 3, icon: '✨' },
  ];

  selectedItems: CalculatorItem[] = [];

  selectCategory(category: Category): void {
    this.activeCategory = category;
    this.selectedItems = [];

    if (category.name === 'Cabello') {
  this.tabs = ['Técnicas', 'Tratamientos', 'Extras'];

  this.items = [
    { name: 'Corte', price: 10 },
    { name: 'Tinte', price: 25 },
    { name: 'Mechas / Rayitos', price: 30 },
    { name: 'Balayage', price: 35 },
    { name: 'Keratina', price: 40 },
    { name: 'Botox Capilar', price: 30 },
  ];
    } else if (category.name === 'Pestañas') {
      this.tabs = ['Servicios', 'Extras', 'Otros'];
      this.items = [
        { name: 'Clásicas', price: 20 },
        { name: 'Volumen 2D', price: 25 },
        { name: 'Volumen 3D', price: 30 },
        { name: 'Volumen 4D', price: 35 },
        { name: 'Mega Volumen', price: 40 },
      ];
    } else if (category.name === 'Cejas') {
      this.tabs = ['Servicios', 'Extras'];
      this.items = [
        { name: 'Diseño de Cejas', price: 8 },
        { name: 'Laminado', price: 18 },
        { name: 'Henna', price: 15 },
        { name: 'Brow Up', price: 20 },
        { name: 'Depilación', price: 5 },
      ];
    } else {
      this.tabs = ['Técnica', 'Extras', 'Cristales', 'Otros'];
      this.items = [
        { name: 'Acrílico', price: 20 },
        { name: 'Soft Gel', price: 18 },
        { name: 'Polygel', price: 17 },
        { name: 'Semipermanente', price: 12 },
        { name: 'Baño Acrílico', price: 15 },
        { name: 'Gel Constructor', price: 13 },
      ];
    }

    this.activeTab = this.tabs[0];
  }

  toggleItem(item: CalculatorItem): void {
    const exists = this.selectedItems.find(
      (selected) => selected.name === item.name,
    );

    if (exists) {
      this.selectedItems = this.selectedItems.filter(
        (selected) => selected.name !== item.name,
      );
      return;
    }

    this.selectedItems = [...this.selectedItems, item];
  }

  isSelected(item: CalculatorItem): boolean {
    return this.selectedItems.some(
      (selected) => selected.name === item.name,
    );
  }

  get total(): number {
    return this.selectedItems.reduce(
      (sum, item) => sum + item.price,
      0,
    );
  }
}