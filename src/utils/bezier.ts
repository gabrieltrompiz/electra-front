/** Creates a smooth bezier curve that passes through all points given and draws them in the given context */
export default function bezierCurveThrough(ctx: CanvasRenderingContext2D, points: Array<Array<number>>, tension: number = 0.25) {

    const l = points.length;

    // If we're given less than two points, there's nothing we can do
    if (l < 2) return;

    // If we only have two points, we can only draw a straight line

    // Helper function to calculate the hypotenuse
    const h = (x: number, y: number) => Math.sqrt(x * x + y * y);

    /* For each interior point, we need to calculate the tangent and pick
     * two points on it that'll serve as control points for curves to and
     * from the point. */
    let cpoints = [];
    points.forEach(() => {
      cpoints.push({});
    });

    for (let i = 1; i < l - 1; i++) {
      let pi = points[i],     // current point
          pp = points[i - 1], // previous point
          pn = points[i + 1]; // next point;

        /* First, we calculate the normalized tangent slope vector (dx,dy).
         * We intentionally don't work with the derivative so we don't have
         * to handle the vertical line edge cases separately. */

        let rdx = pn[0] - pp[0],  // actual delta-x between previous and next points
            rdy = pn[1] - pp[1],  // actual delta-y between previous and next points
            rd = h(rdx, rdy),     // actual distance between previous and next points
            dx = rdx / rd,        // normalized delta-x (so the total distance is 1)
            dy = rdy / rd;        // normalized delta-y (so the total distance is 1)

        /* Next we calculate distances to previous and next points, so we
         * know how far out to put the control points on the tangents (tension).
         */

        let dp = h(pi[0] - pp[0], pi[1] - pp[1]), // distance to previous point
            dn = h(pi[0] - pn[0], pi[1] - pn[1]); // distance to next point

        /* Now we can calculate control points. Previous control point is
         * located on the tangent of the curve, with the distance between it
         * and the current point being a fraction of the distance between the
         * current point and the previous point. Analogous to next point. */

        let cpx = pi[0] - dx * dp * tension,
            cpy = pi[1] - dy * dp * tension,
            cnx = pi[0] + dx * dn * tension,
            cny = pi[1] + dy * dn * tension;

        cpoints[i] = {
          cp: [cpx, cpy], // previous control point
          cn: [cnx, cny], // next control point
       };
    }

    /* For the end points, we only need to calculate one control point.
     * Picking a point in the middle between the endpoint and the other's
     * control point seems to work well. */

    cpoints[0] = {
      cn: [ (points[0][0] + cpoints[1].cp[0]) / 2, (points[0][1] + cpoints[1].cp[1]) / 2 ],
    };
    cpoints[l - 1] = {
      cp: [ (points[l - 1][0] + cpoints[l - 2].cn[0]) / 2, (points[l - 1][1] + cpoints[l - 2].cn[1]) / 2 ],
    };

    /* Now we can draw! */

    for (let i = 1; i < l; i++) {
      let p = points[i],
        cp = cpoints[i],
        cpp = cpoints[i - 1];

      /* Each bezier curve uses the "next control point" of first point
        * point, and "previous control point" of second point. */
      if(cpp.cn && cp.cp)
        ctx.bezierCurveTo(cpp.cn[0], cpp.cn[1], cp.cp[0], cp.cp[1], p[0], p[1]);
    }

}