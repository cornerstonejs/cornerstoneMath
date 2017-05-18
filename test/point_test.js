import { expect } from 'chai';
import point from '../src/point';

describe('point', function () {

  describe('#copy', function () {

    it('should create a copy of a given point', function () {
      const firstPoint = {
        x: 1.23,
        y: 3.21
      };

      const secondPoint = point.copy(firstPoint);

      expect(secondPoint.x).to.be.equal(firstPoint.x);
      expect(secondPoint.y).to.be.equal(firstPoint.y);
    });

  });

});
