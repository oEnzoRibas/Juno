/* Local Windows COM supplies proofOutput. Work only on the fresh proof document. */
(function () {
  var s = stringIDToTypeID;
  var c = charIDToTypeID;
  var doc;
  var original = app.documents.length ? app.activeDocument : null;
  var oldDialogs = app.displayDialogs;
  var oldUnits = app.preferences.rulerUnits;
  var target = new File(proofOutput + '/proof.psd');
  var image = new File(proofOutput + '/proof.png');

  function rgb(r, g, b) {
    var color = new ActionDescriptor();
    color.putDouble(c('Rd  '), r);
    color.putDouble(c('Grn '), g);
    color.putDouble(c('Bl  '), b);
    return color;
  }

  function makeFill(type, definition, geometry) {
    var payload = new ActionDescriptor();
    payload.putObject(c('Type'), s(type), definition);
    if (geometry) payload.putObject(c('Shp '), s('ellipse'), geometry);
    var ref = new ActionReference();
    ref.putClass(s('contentLayer'));
    var make = new ActionDescriptor();
    make.putReference(c('null'), ref);
    make.putObject(c('Usng'), s('contentLayer'), payload);
    executeAction(c('Mk  '), make, DialogModes.NO);
    return doc.activeLayer;
  }

  function ellipse(name, x, y, width, height, color) {
    var bounds = new ActionDescriptor();
    bounds.putUnitDouble(c('Left'), c('#Pxl'), x);
    bounds.putUnitDouble(c('Top '), c('#Pxl'), y);
    bounds.putUnitDouble(c('Rght'), c('#Pxl'), x + width);
    bounds.putUnitDouble(c('Btom'), c('#Pxl'), y + height);
    var fill = new ActionDescriptor();
    fill.putObject(c('Clr '), c('RGBC'), color);
    var layer = makeFill('solidColorLayer', fill, bounds);
    layer.name = name;
    return layer;
  }

  function stops(values, opacity) {
    var list = new ActionList();
    for (var i = 0; i < values.length; i++) {
      var stop = new ActionDescriptor();
      stop.putInteger(c('Lctn'), i * 4096);
      stop.putInteger(c('Mdpn'), 50);
      if (opacity) stop.putUnitDouble(c('Opct'), c('#Prc'), 100);
      else {
        stop.putObject(c('Clr '), c('RGBC'), values[i]);
        stop.putEnumerated(c('Type'), c('Clry'), c('UsrS'));
      }
      list.putObject(opacity ? c('TrnS') : c('Clrt'), stop);
    }
    return list;
  }

  function addGradient() {
    var gradient = new ActionDescriptor();
    gradient.putString(c('Nm  '), 'Violet to lilac');
    gradient.putEnumerated(c('GrdF'), c('GrdF'), c('CstS'));
    gradient.putDouble(c('Intr'), 4096);
    gradient.putList(c('Clrs'), stops([rgb(87, 47, 160), rgb(194, 163, 247)], false));
    gradient.putList(c('Trns'), stops([100, 100], true));
    var fill = new ActionDescriptor();
    fill.putObject(c('Grad'), c('Grdn'), gradient);
    fill.putEnumerated(c('Type'), c('GrdT'), c('Lnr '));
    fill.putUnitDouble(c('Angl'), c('#Ang'), 72);
    var layer = makeFill('gradientLayer', fill);
    layer.name = 'Violet lighting';
    layer.grouped = true;
    return layer;
  }

  function inspect() {
    var body = doc.layerSets.getByName('Study').artLayers;
    if (
      body.getByName('Body').kind !== LayerKind.SOLIDFILL ||
      body.getByName('Violet lighting').kind !== LayerKind.GRADIENTFILL ||
      !body.getByName('Violet lighting').grouped ||
      body.getByName('Beacon').kind !== LayerKind.SMARTOBJECT ||
      !doc.pathItems.getByName('Construction triangle') ||
      doc.colorProfileName !== 'sRGB IEC61966-2.1'
    )
      throw Error('Unexpected reopened layer structure or profile.');
    return body.getByName('Beacon');
  }

  try {
    app.displayDialogs = DialogModes.NO;
    app.preferences.rulerUnits = Units.PIXELS;
    doc = app.documents.add(
      384,
      384,
      72,
      'Synthetic color study',
      NewDocumentMode.RGB,
      DocumentFill.TRANSPARENT,
      1,
      BitsPerChannelType.EIGHT,
      'sRGB IEC61966-2.1',
    );
    var empty = doc.activeLayer;
    var group = doc.layerSets.add();
    group.name = 'Study';
    var shape = ellipse('Body', 64, 78, 256, 240, rgb(109, 69, 183));
    shape.move(group, ElementPlacement.INSIDE);
    doc.activeLayer = shape;
    var lighting = addGradient();
    var beacon = ellipse('Accent', 210, 100, 50, 50, rgb(255, 196, 67));
    executeAction(s('newPlacedLayer'), undefined, DialogModes.NO);
    beacon = doc.activeLayer;
    beacon.name = 'Beacon';
    beacon.visible = false;
    var vertices = [
      [192, 66],
      [330, 322],
      [54, 322],
    ];
    var points = [];
    for (var i = 0; i < vertices.length; i++) {
      var p = new PathPointInfo();
      p.kind = PointKind.CORNERPOINT;
      p.anchor = p.leftDirection = p.rightDirection = vertices[i];
      points.push(p);
    }
    var sub = new SubPathInfo();
    sub.closed = true;
    sub.operation = ShapeOperation.SHAPEADD;
    sub.entireSubPath = points;
    doc.pathItems.add('Construction triangle', [sub]);
    empty.remove();
    doc.activeLayer = shape;
    beacon.visible = false;
    doc.saveAs(target, new PhotoshopSaveOptions(), false, Extension.LOWERCASE);
    doc.close(SaveOptions.DONOTSAVECHANGES);
    doc = null;
    doc = app.open(target);
    beacon = inspect();
    if (beacon.visible) throw Error('First save lost hidden state.');
    beacon.visible = true;
    var before = beacon.bounds[0].as('px');
    beacon.translate(18, 0);
    doc.save();
    doc.close(SaveOptions.DONOTSAVECHANGES);
    doc = null;
    doc = app.open(target);
    beacon = inspect();
    if (!beacon.visible || beacon.bounds[0].as('px') !== before + 18)
      throw Error('Edited component failed round trip.');
    doc.saveAs(image, new PNGSaveOptions(), true, Extension.LOWERCASE);
    return 'PASS 384x384 sRGB; Study/Body solid vector shape; clipped Violet lighting gradient; Construction triangle path; embedded Beacon visible and translated 18px after two native reopens.';
  } finally {
    if (doc) doc.close(SaveOptions.DONOTSAVECHANGES);
    app.preferences.rulerUnits = oldUnits;
    app.displayDialogs = oldDialogs;
    if (original) app.activeDocument = original;
  }
})();
