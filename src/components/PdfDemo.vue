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
  mounted() {
    this.LoadPDF();
  },
  data() {
    return {
      scale: 1.5
    };
  },
  methods: {
    LoadPDF: async function() {
      let that = this;
      let PDFInstance = PDFJS.getDocument({ data: atob(pdfBase64) });
      PDFInstance.then(pdf => {
        pdf.getPage(1).then(page => {
          console.log("Loaded Page");
          var viewport = page.getViewport(that.scale);
          var $canvas = jQuery(that.$refs["PDFLayer"]);
          
          var canvas = $canvas.get(0);
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          //Append the canvas to the pdf container div
          var $pdfContainer = jQuery(that.$refs["pdfContainerRef"]);
          $pdfContainer
            .css("height", canvas.height + "px")
            .css("width", canvas.width + "px");

          //The following few lines of code set up scaling on the context if we are on a HiDPI display
          var outputScale = getOutputScale();
          if (outputScale.scaled) {
            var cssScale =
              "scale(" + 1 / outputScale.sx + ", " + 1 / outputScale.sy + ")";
            CustomStyle.setProp("transform", canvas, cssScale);
            CustomStyle.setProp("transformOrigin", canvas, "0% 0%");

            if ($textLayerDiv.get(0)) {
              CustomStyle.setProp("transform", $textLayerDiv.get(0), cssScale);
              CustomStyle.setProp(
                "transformOrigin",
                $textLayerDiv.get(0),
                "0% 0%"
              );
            }
          }

          context._scaleX = outputScale.sx;
          context._scaleY = outputScale.sy;
          if (outputScale.scaled) {
            context.scale(outputScale.sx, outputScale.sy);
          }

          var canvasOffset = $canvas.offset();
          var $textLayerDiv = jQuery(that.$refs["textLayerRef"])
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
              var textLayer = new TextLayerBuilder({
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
