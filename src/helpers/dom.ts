import { createElement, FunctionComponent, ReactElement } from "react";
import { render } from "react-dom";
import { LatLng } from "types";
import { extractCoordinate } from "./travel";

function insertIntoDOM(content: ReactElement, reactRoot: HTMLDivElement) {
  const main = document.querySelector("[itemprop='streetAddress']");
  main?.prepend(reactRoot);
  render(content, reactRoot);
}

// eslint-disable-next-line import/prefer-default-export
export function setupDOM(element: FunctionComponent): void {
  /*
   * Create an keep references to our react componenent and rootNode.
   * This prevents us re-creating the component each time we re-insert,
   * thus preventing re-registering the storage listeners and the
   * conflicts this causes
   */
  const content: ReactElement = createElement(element);
  const reactRoot: HTMLDivElement = document.createElement("div");

  insertIntoDOM(content, reactRoot);

  /*
   * NB: Rightmove Specific
   * Whilst viewing a property a user can view a gallery or map, triggering
   * the DOM to change and our rootNode to be removed. To counter this we
   * register a listener to check for when the user has returned to the standard
   * property view (no suffix after the /) and then re-insert our component
   */
  window.addEventListener("hashchange", async (e) => {
    // we have returned from either map or gallery view to main page
    if (e.newURL.endsWith("#/")) {
      await new Promise((r) => setTimeout(r, 50));
      // re-create root node since it will have been removed from DOM by Rightmove's React src
      insertIntoDOM(content, reactRoot);
    }
  });
}

export function getMapImgSrc(document: Document): LatLng {
  const imgElement = document.querySelector(
    'img[src^="https://media.rightmove.co.uk/map/"]'
  );
  if (imgElement) {
    const imgSrc = imgElement.getAttribute("src");
    if (imgSrc) {
      const longitude = extractCoordinate("longitude", imgSrc);
      const latitude = extractCoordinate("latitude", imgSrc);
      return { latitude, longitude };
    }
  } else {
    console.log("content: failed to locate img on page");
  }
  return { latitude: 0, longitude: 0 };
}
