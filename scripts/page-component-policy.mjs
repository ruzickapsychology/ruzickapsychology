import ts from "typescript";

/** Check render-only boundaries and shared controls without matching comments. */
export function pageComponentViolations(source, filename = "page.tsx") {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors = [];
  const sharedElements = new Map([
    ["input", "Input"],
    ["textarea", "Textarea"],
    ["label", "FieldLabel"],
    ["details", "DisclosureItem"],
    ["summary", "DisclosureTrigger"],
  ]);
  function report(node, message) {
    const line =
      file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
    errors.push(`${filename}:${line} ${message}`);
  }
  function attribute(element, name) {
    return element.attributes.properties.find(
      (item) => ts.isJsxAttribute(item) && item.name.getText(file) === name,
    );
  }
  function isTrueAttribute(attr) {
    return (
      !!attr &&
      (!attr.initializer ||
        (ts.isStringLiteral(attr.initializer) &&
          attr.initializer.text === "true") ||
        (ts.isJsxExpression(attr.initializer) &&
          attr.initializer.expression?.kind === ts.SyntaxKind.TrueKeyword))
    );
  }
  function visit(node, hidden = false) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.startsWith("@/data/")
    ) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      const typesOnly =
        clause?.isTypeOnly ||
        (!clause?.name &&
          bindings &&
          ts.isNamedImports(bindings) &&
          bindings.elements.length > 0 &&
          bindings.elements.every((item) => item.isTypeOnly));
      if (!typesOnly)
        report(
          node,
          "loads the data layer from a page module; load route data in src/app and pass typed props. Put pure presentation helpers in src/lib.",
        );
    }
    const element = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : undefined;
    if (element) {
      hidden =
        hidden ||
        isTrueAttribute(attribute(element, "aria-hidden")) ||
        isTrueAttribute(attribute(element, "hidden"));
      const tag = element.tagName.getText(file);
      const type = attribute(element, "type")?.initializer;
      const hiddenInput =
        tag === "input" &&
        type &&
        ts.isStringLiteral(type) &&
        type.text === "hidden";
      if (!hidden && !hiddenInput && sharedElements.has(tag))
        report(
          element,
          `uses raw <${tag}>; compose the shared ${sharedElements.get(tag)} primitive.`,
        );
    }
    ts.forEachChild(node, (child) => visit(child, hidden));
  }
  visit(file);
  return errors;
}
