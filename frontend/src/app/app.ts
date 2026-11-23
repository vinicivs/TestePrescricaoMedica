import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar no-print">
      <a routerLink="/prescriptions" class="topbar__brand">Prescrição Eletrônica</a>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class App {}
