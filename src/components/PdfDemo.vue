<template>
    <div ref="pdfContainerRef" id="pdfContainer" class="pdf-content">
      <canvas ref="PDFLayer"/>
      <div class="textLayer" ref="textLayerRef"/>
    </div>
</template>
<script>
import * as PDFJS from "pdfjs-dist";
import jQuery from "jquery";
import { pdfBase64 } from "./DemoPDFBase64.js";
import {
  getOutputScale,
  CustomStyle,
  GetCanvasOffset
} from "./PDFRenderer/TextLayerBuilder.js";
import { TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer";
import "./PDFRenderer/RenderStyle.css";
export default {
  name: "PdfDemo",
  props:['TestProps'],
  mounted() {
    this.LoadPDF();
    console.log(this.TestProps);
  },
  data() {
    return {
      scale: 1.5
    };
  },
  watch:{
    TestProps:function(nv,ov){console.log.apply(this,arguments)}
  },
  methods: {
    LoadPDF: async function() {
      let that = this;
      let PDFInstance = PDFJS.getDocument({ data: atob(pdfBase64) });
      PDFInstance.then(pdf => {
        pdf.getPage(1).then(page => {
          console.log("Loaded Page");
          let viewport = page.getViewport(that.scale);
          let $canvas = jQuery(that.$refs["PDFLayer"]);
          let canvas = $canvas.get(0);
          let context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let $textLayerDiv = jQuery(that.$refs["textLayerRef"]);
          //Append the canvas to the pdf container div
          let $pdfContainer = jQuery(that.$refs["pdfContainerRef"]);
          $pdfContainer
            .css("height", canvas.height + "px")
            .css("width", canvas.width + "px");


            //高分屏适配
          let outputScale = getOutputScale();
          if (outputScale.scaled) {
            let cssScale =
              "scale(" + 1 / outputScale.sx + ", " + 1 / outputScale.sy + ")";
              CustomStyle.setProp("transform", canvas, cssScale);
            CustomStyle.setProp("transformOrigin", canvas, "0% 0%");
            if ($textLayerDiv.get(0)) {
              CustomStyle.setProp(
                "transformOrigin",
                $textLayerDiv.get(0),
                "0% 0%"
              );
            }
            //重新放大 适配高分辨率
            canvas.height = viewport.height * outputScale.sx;
            canvas.width = viewport.width * outputScale.sy;
            context.scale(outputScale.sx,outputScale.sy);
          }

          let canvasOffset = $canvas.offset();
          $textLayerDiv
            .css("height", viewport.height + "px")
            .css("width", viewport.width + "px")
            .offset({
              top: canvasOffset.top,
              left: canvasOffset.left
            });
          let renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page
            .render(renderContext)
            .then(() => page.getTextContent())
            .then(textContent => {
              let textLayer = new TextLayerBuilder({
                textLayerDiv: that.$refs["textLayerRef"],
                pageIndex: page.pageIndex,
                viewport: viewport
              });
              textLayer.setTextContent(textContent);
              textLayer.render();
            });
        });
      });
    }
  }
};
</script>
