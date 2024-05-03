<a name="readme-top"></a>

<!-- Presentation Block -->
<br />

<div align="center">

  <a href="https://github.com/LightDestory/IoT_CapybaraSafe">
    <img src="https://raw.githubusercontent.com/LightDestory/IoT_CapybaraSafe/master/.github/assets/images/presentation_image.jpg" alt="Preview" width="60%">
  </a>

  <h2 align="center">IoT_CapybaraSafe</h2>
  
  <p align="center">
      CapybaraSafe: Sicurezza e Tracciatura degli Operatori nella NO-IP Zone attraverso un Sistema IoT
  </p>

  <p align="center">
      Internet Of Things 23/23 @ UniCT DMI
  </p>
  
  <br />
  <br />

</div>

<!-- ToC -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#book-about-the-project">📖 About The Project</a>
    </li>
    <li>
      <a href="#gear-getting-started">⚙️ Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#extension-board-schema">Extension Board Schema</a></li>
        <li><a href="#compile-and-flash">Compile and Flash</a></li>
      </ul>
    </li>
    <li><a href="#hammer_and_wrench-developed-by">🛠️ Developed By</a></li>
  </ol>
</details>

<!-- About Block -->

## :book: About The Project

 Il progetto propone un sistema per il monitoraggio e la sicurezza degli operatori all’interno di una NO-IP Zone, attraverso l’implementazione di una soluzione IoT innovativa. Utilizzando dispositivi personali avanzati, come le Smartband dotate di sensori quali giroscopio, accelerometro e ossimetro, il sistema offre una tracciatura precisa della posizione degli operatori, insieme a una dettagliata analisi dello stato di salute dell'operatore e dei tempi di percorrenza e di stallo nel tunnel.

 Una relazione completa del progetto è situata [qui](/docs/Relazione.pdf).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Setup Block -->

## :gear: Getting Started

Il progetto è stato sviluppato basandosi sulla board LilyGo Lora32 v1.6.1 dotata di stack di networking come Wi-FI, BL, BLE, LoRa.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

Per poter compilare e flashare questo firmware sulla scheda sono necessari i seguenti prerequisiti:

- Per Visual Studio Code installa l'estensione PlatformIO;
  - È possibile utilizzare CLion con il plugin PlatformIO;
- La scheda di estensione di riferimento contenente tutti i componenti hardware necessari.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Extension Board Schema

WIP

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Compile and Flash

Dentro la cartella `embedded` è possibile trovare i sorgenti del `Personal Device` e del `Gateway/Ancora`.

Flashare opportunamente i dispositivi.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## :hammer_and_wrench: Developed By

- Alessio Tudisco
- <a href="https://github.com/miryrusso">Miriana Russo</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
