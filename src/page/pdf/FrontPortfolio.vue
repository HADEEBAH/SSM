<template>
  <v-app>
    <v-container>
      Pdf test
    </v-container>
  </v-app>
</template>
  <script>
  // const { loadImage } = require('canvas')
  import pdfMake from 'pdfmake'
  import pdfFonts from '../../assets/custom-fonts.js'
  export default {
    name: "FrontPortfolio",
    components: {},
    data: () => ({
      user_profile : null,
    }),
    created() {},
    mounted() {
      this.exportPdf()
    },
    methods: {
      async exportPdf() {
        // Define the image paths
        var backgroundImagePath = require('../../assets/FrontPortfolio/bg-front.png');
        var headerImagePath = require('../../assets/FrontPortfolio/Logo.png');

        // Load the images using the file loader
        var backgroundImageData = await this.loadImageFromFile(backgroundImagePath);
        var headerImageData = await this.loadImageFromFile(headerImagePath);
        // Convert image URLs to data URLs directly
        var backgroundImageDataUrl = await this.convertImageToDataFile(backgroundImageData);
        var headerImageDataUrl = await this.convertImageToDataFile(headerImageData);
        pdfMake.vfs = pdfFonts.pdfMake.vfs
        pdfMake.fonts = {
            Kanit: {
              normal: 'Kanit-Regular.ttf',
              bold: 'Kanit-Bold.ttf',
              italics: 'Kanit-Italic.ttf',
              bolditalics: 'Kanit-BoldItalic.ttf'          
            },
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
            },
        }
        const docDefinition = {
          pageSize: 'A4',
          pageMargins: [ 40, 30, 40, 20 ], //ซ้ายบนขาวล่าง
          background: {
            image: backgroundImageDataUrl,
            height: 850,
            width: 600,
          },
          header:{
            columns: [
              {text:''},
              { 
                image: headerImageDataUrl,
                width: 80,
                height: 80,
                alignment: 'right',
              }, 
            ],
          },
          footer: {
            columns: [
              'Left part',
              { text: 'Right part', alignment: 'right' }
            ]
          },
          content: [
            {text:"Portfolio", style:['header']},
            {text:[
              'โรงเรียนวรพัฒน์ Warraphat School'
            ],style:['subheader']}
          ],
          defaultStyle: {
            font: 'Kanit'
          },
          styles: {
            header: {
              fontSize: 82.4,
              color:"#573e33"
            },
            subheader: {
              fontSize: 21.5,
              color:"#ffa8ae"
            },
            anotherStyle: {
              italics: true,
              alignment: 'right'
            }
          }
        }
        console.log(docDefinition)
        let pdfDoc = pdfMake.createPdf(docDefinition)
        pdfDoc.getBlob((blob) => {
          var url = URL.createObjectURL(blob);

          // Open the PDF in a new tab
          window.open(url);
        });
      },
      loadImageFromFile(filePath) {
        return new Promise((resolve, reject) => {
          var img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.onerror = (error) => {
            reject(error);
          };
          img.src = filePath;
        });
      },
      convertImageToDataFile(image) {
        return new Promise((resolve, reject) => {
          var canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;

          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);

          canvas.toBlob((blob) => {
            var reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsDataURL(blob);
          }, 'image/png');
        });
      },
      getBase64ImageFromURL(url) {
        return new Promise((resolve, reject) => {
          var img = new Image();
          img.setAttribute("crossOrigin", "anonymous");

          img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            resolve(dataURL);
          };

          img.onerror = error => {
            reject(error);
          };

          img.src = url;
        });
      },
    },
  }
  </script>
  