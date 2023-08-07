<template>
    <v-app>
      <v-container>
        <!-- <pre>{{  this.GenCourses() }}</pre> -->
        <loadingOverlay :loading="true"></loadingOverlay>
      </v-container>
    </v-app>
  </template>
    <script>
    // const { loadImage } = require('canvas')
    import pdfMake from 'pdfmake'
    import pdfFonts from '../../assets/custom-fonts.js'
    import loadingOverlay from "../../components/loading/loadingOverlay.vue";
    import { mapActions, mapGetters } from 'vuex';
    import moment from 'moment';
    // import axios from "axios";
    export default {
      name: "FrontPortfolio",
      components: {
        loadingOverlay
      },
      data: () => ({
        user_profile : null,
        images_files: {},
      }),
      async created() {
        await this.GetPortfolioData({account_id : this.$route.params.account_id}).then(()=>{
          if(this.portfolio_data){
            this.exportPdf()
          }
        })
      },
      mounted() {},
      methods: {
        ...mapActions({
          GetPortfolioData : 'portfolioModules/GetPortfolioData'
        }),
        GenCourses(){
          // let defaultProfile = require('../../assets/profile/default_profile.png')
          // let defaultProfileImageData =  await this.loadImageFromFile(defaultProfile);
          // let defaultProfileImageDataUrl = await this.convertImageToDataFile(defaultProfileImageData);
          // console.log("37=>",this.portfolio_data)
          let courses = []
          let course_index = []
          for (let course of this.portfolio_data.courses){
            course_index.push('x')
            // console.log("40=>",course)
            // IMG 
            let img_arr = []
            let img_col = []
            if(course.attachmensPictureAll){
              for (let img of course.attachmensPictureAll){
                // // console.log(img)
                this.images_files[img.attachmentAssessmentId] = img.assessmentAttachmentFilesUrl
                img_col.push({
                  text: `${img.attachmentAssessmentId}`,
                  width: '50%',
                })
              }
            }else{
              img_col.push({  
                width: '50%',
                text : ''
              })
            }
           
            if(course_index.length === this.portfolio_data.courses.length){
              img_arr.push({
                columns : [...img_col]
              })
            }else{
              img_arr.push({
                columns : [...img_col],
                pageBreak: 'after', 
              })
            }
            let ass_arr = []
            let assed = []
            for(let ass of course.assessments){
              assed.push(ass)
              // console.log("47=>",ass)
              let ass_columns = []
              if(ass.assessmentAttachmentFilesUrl){
                this.images_files[ass.attachmentAssessmentId] = ass.assessmentAttachmentFilesUrl
                ass_columns.push({
                  alignment : 'center',
                  width: '50%',
                  text: ass.attachmentAssessmentId,
                })
              }else{
                ass_columns.push({
                  alignment : 'center',
                  width: '50%',
                  text: ""
                })
              }
              ass_columns.push({
                width: '50%',
                stack:[
                  {text:[
                    {text : `วันที่: ${moment(ass.assessmentCreatedDate).format("DD/MM/YYYY")}`},
                    // {text : 'สถานะ', blod: true},
                    // {text : '', blod: true},
                  ]},
                  { text : "ระดับพัฒนาการ" },
                  { text : ass.assessmentEvolution ? ass.assessmentEvolution : '-' },
                  { text : "ระดับความสนใจ" },
                  { text : ass.assessmentInterest ? ass.assessmentInterest : '-' },
                  { text : "ความคิดเห็น" },
                  { text : ass.assessmentRemark ? ass.assessmentRemark : '-' },
                ]
              })
            if(assed.length < course.assessments.length){
                ass_arr.push({
                  columns: [...ass_columns],
                })
                ass_arr.push({
                  alignment : 'center',
                  margin: [0, 20, 0, 20],
                  canvas: [
                    {
                      
                      type: 'line',
                      x1: 0,
                      y1: 0,
                      x2: 200,
                      y2: 0,
                      lineWidth: 1,
                      color:'#999'
                    }
                  ]
                })
              }else if( assed.length == course.assessments.length){
                ass_arr.push({
                  columns: [...ass_columns],
                  pageBreak: 'after', 
                })
              }else if((assed.length % 3) === 0 ){
                ass_arr.push({
                  columns: [...ass_columns],
                  pageBreak: 'after', 
                })
                ass_arr.push([
                  {
                    margin: [0, 0, 0, 10],
                    stack: [
                      {
                          text : course.courseNameTh,
                          fontSize: 26.4,
                          margin: [0, 20, 0, 0],
                          color:"#573e33",
                          bold:true,
                      },
                      {
                          text : course.coachNameTh,
                          fontSize: 26.4,
                          margin: [0, -10, 0, 0],
                          color:"#573e33",
                      }   
                    ]
                  }, 
                  {
                      text : "ประเมินรายครั้ง",
                      bold:true,
                      alignment: 'center',
                      fontSize: 25.9,
                      color:"#573e33",
                  },
                ])
              }
            }
            let potential_arr = []
            let potential_columns = []
            if( course.assessmentPotentials.potentialAttachmentFilesUrl){ 
              // this.images_files[course.assessmentPotentials.attachmentPotentialId] = course.assessmentPotentials.assessmentAttachmentFilesUrl
              // // console.log("179 => ",course.assessmentPotentials.attachmentPotentialId)
              potential_columns.push({
                alignment : 'center',
                width: '50%',
                text: `${course.assessmentPotentials.attachmentPotentialId}`
              })   
            }else{
              potential_columns.push({
                width: '50%',
                text: ""
              })  
            }
            potential_columns.push( {
              width: '50%',
              stack:[
                { text : `วันที่: ${moment(course.assessmentPotentials.potentialCreatedDate).format("DD/MM/YYYY")}`},
                { text : "ระดับพัฒนาการ" },
                { text : course.assessmentPotentials.potentialEvolution ? course.assessmentPotentials.potentialEvolution : '-' },
                { text : "ระดับความสนใจ" },
                { text : course.assessmentPotentials.potentialInterest ? course.assessmentPotentials.potentialInterest : '-' },
              ]
            })  
            potential_arr.push({
              columns: [...potential_columns],
            })
            potential_arr.push({
              stack:[
                { text : "ความคิดเห็น" },
                { text : course.assessmentPotentials.potentialRemark ? course.assessmentPotentials.potentialRemark : '-' },
              ],
              pageBreak: 'after', 
            })
            courses.push(
              {
                margin: [0, 0, 0, 10],
                stack: [
                  {
                      text : course.courseNameTh,
                      fontSize: 26.4,
                      margin: [0, 20, 0, 0],
                      color:"#573e33",
                      bold:true,
                  },
                  {
                      text : course.coachNameTh,
                      fontSize: 26.4,
                      margin: [0, -10, 0, 0],
                      color:"#573e33",
                  }   
                ]
              }, 
              {
                  text : "ประเมินศักยภาพ",
                  bold:true,
                  alignment: 'center',
                  fontSize: 25.9,
                  color:"#573e33",
              },
              ...potential_arr,
              {
                margin: [0, 0, 0, 10],
                stack: [
                  {
                      text : course.courseNameTh,
                      fontSize: 26.4,
                      margin: [0, 20, 0, 0],
                      color:"#573e33",
                      bold:true,
                  },
                  {
                      text : course.coachNameTh,
                      fontSize: 26.4,
                      margin: [0, -10, 0, 0],
                      color:"#573e33",
                  }   
                ]
              }, 
              {
                  text : "ประเมินรายครั้ง",
                  bold:true,
                  alignment: 'center',
                  fontSize: 25.9,
                  color:"#573e33",
              },
              ...ass_arr,
              {
                margin: [0, 0, 0, 10],
                stack: [
                  {
                      text : course.courseNameTh,
                      fontSize: 26.4,
                      margin: [0, 20, 0, 0],
                      color:"#573e33",
                      bold:true,
                  },
                  {
                      text : course.coachNameTh,
                      fontSize: 26.4,
                      margin: [0, -10, 0, 0],
                      color:"#573e33",
                  }   
                ]
              }, 
              {
                  text : "ภาพกิจกรรม",
                  bold:true,
                  alignment: 'center',
                  fontSize: 25.9,
                  color:"#573e33",
              },
              ...img_arr
            )
          }
          return courses
        },
        async exportPdf() {
          // Define the image paths
          var backgroundImagePath = require('../../assets/FrontPortfolio/bg-front-detail.png');
          var backgroundDetailImagePath = require('../../assets/FrontPortfolio/bg-detail.png');
          let defaultProfile = require('../../assets/profile/default_profile.png')

          // Load the images using the file loader
          let defaultProfileImageData = await this.loadImageFromFile(defaultProfile);
          var backgroundImageData = await this.loadImageFromFile(backgroundImagePath);
          var backgroundDetailImageData = await this.loadImageFromFile(backgroundDetailImagePath);
          // Convert image URLs to data URLs directly
          let defaultProfileImageDataUrl = await this.convertImageToDataFile(defaultProfileImageData);
          var backgroundImageDataUrl = await this.convertImageToDataFile(backgroundImageData);
          var backgroundDetailImageDataUrl = await this.convertImageToDataFile(backgroundDetailImageData);
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
            background: function(currentPage) {
                if (currentPage === 1) {
                    return {
                        image: backgroundImageDataUrl, // URL or file path of the background image
                        height: 850,
                        width: 600,
                    };
                } else {
                    return {
                        image: backgroundDetailImageDataUrl, // URL or file path of the background image
                        height: 850,
                        width: 600,
                    }
                }
            },
            content: [{
                stack: [
                    {text:"Portfolio", style:['header']},
                    {text:[
                        'โรงเรียนวรพัฒน์ Warraphat School'
                    ],style:['subheader']},
                    ]
                },
                {
                    margin: [0, 30, 0, 30],
                    alignment: 'center',
                    image:'profile',
                    width:400,
                    height:450,
                },
                {
                  alignment:'left',
                  margin: [60, 0, 0, 0],  
                  stack: [
                    {
                        text: [ {text:`${this.portfolio_data.firstNameTh} ${this.portfolio_data.lastNameTh}`,fontSize: 30, bold: true}],
                        color: '#573e33',
                        margin: [0, 0]
                    },
                    {
                        text: [ {text:`${this.portfolio_data.firstNameEn ? this.portfolio_data.firstNameEn : ''} ${this.portfolio_data.lastNameEn ? this.portfolio_data.lastNameEn : ''}`,fontSize: 21}],
                        color: '#ff6b81',
                        margin: [0, 0]
                    },
                    {
                        text: [ {text:`${this.portfolio_data.email}`,fontSize: 21}],
                        color: '#ff6b81',
                        margin: [0, 0]
                    },
                    {
                        text: [ {text:`${this.portfolio_data.tel}`,fontSize: 21}],
                        color: '#ff6b81',
                        margin: [0, 0]
                    },
                  ],
                  pageBreak: 'after' 
                },
                ...await this.GenCourses(),
            ],
            defaultStyle: {
              font: 'Kanit'
            },
            styles: {
              header: {
                margin: [0, 0, 0, 0],
                fontSize: 82.4,
                color:"#573e33"
              },
              subheader: {
                margin: [0,-20, 0, 0],
                fontSize: 21.5,
                color:"#ffa8ae"
              },
              anotherStyle: {
                italics: true,
                alignment: 'right'
              }
            },
            images: {
              profile : this.portfolio_data.image ? this.portfolio_data.image : defaultProfileImageDataUrl,
              ...this.images_files,
            }
          }
          
          pdfMake.createPdf(docDefinition).open({}, window)
          // let pdfDoc = pdfMake.createPdf(docDefinition)
          // pdfDoc.getBlob((blob) => {
          //   var url = URL.createObjectURL(blob);
            
          //   // Open the PDF in a new tab
          //   window.open(url);
          // });
        },
        async currentPageBg(currentPage) {
            // Define the image paths
            var backgroundImagePath = require('../../assets/FrontPortfolio/bg-front-detail.png');
            var backgroundDetailImagePath = require('../../assets/FrontPortfolio/bg-detail.png');
    
            // Load the images using the file loader
            var backgroundImageData = await this.loadImageFromFile(backgroundImagePath);
            var backgroundDetailImageData = await this.loadImageFromFile(backgroundDetailImagePath);
            // Convert image URLs to data URLs directly
            var backgroundImageDataUrl = await this.convertImageToDataFile(backgroundImageData);
            var backgroundDetailImageDataUrl = await this.convertImageToDataFile(backgroundDetailImageData);
            if (currentPage === 1) {
                return {
                    image: backgroundImageDataUrl, // URL or file path of the background image
                    height: 850,
                    width: 600,
                };
            } else {
                return {
                    image: backgroundDetailImageDataUrl, // URL or file path of the background image
                    height: 850,
                    width: 600,
                };
            }
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
            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement('canvas');
              canvas.width = this.width;
              canvas.height = this.height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(this, 0, 0);

              const dataURL = canvas.toDataURL();
              resolve(dataURL);
            };

            img.onerror = function (error) {
              reject(error);
            };

            img.crossOrigin = 'Anonymous';
            img.src = url;
          });
        }
      },
      computed: {
        ...mapGetters({
          portfolio_data : 'portfolioModules/portfolioData'
        }),
      }
    }
    </script>
    