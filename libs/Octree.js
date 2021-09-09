import {
	Box3,
	Line3,
	Plane,
	Sphere,
	Triangle,
	Vector3
} from './three.module.js';
import { Capsule } from './Capsule.js';


const _v1 = new Vector3();
const _v2 = new Vector3();
const _plane = new Plane();
const _line1 = new Line3();
const _line2 = new Line3();
const _sphere = new Sphere();
const _capsule = new Capsule();

class Octree {


	constructor( box ) {
        //cameraPos Vector3()
		//distance  int
		//this.triangles = [];//猜三角面片
		/*this.box = new Box3();
		this.box.min.x = cameraPos.x - distance;
		this.box.min.y = cameraPos.y - distance;
		this.box.min.z = cameraPos.z - distance;
		this.box.max.x = cameraPos.x + distance;
		this.box.max.y = cameraPos.y + distance;
		this.box.max.z = cameraPos.z + distance;*/
		this.box = box;

		this.subTrees = [];//分支树
		this.points = [];
		this.nums=[];//物体点的编号

	}

	/*addTriangle( triangle ) {//添加三角面片

		if ( ! this.bounds ) this.bounds = new Box3();//box对象
        //bounds边界，新加进来三角面片后更新边界 因此min取小，max取大
		this.bounds.min.x = Math.min( this.bounds.min.x, triangle.a.x, triangle.b.x, triangle.c.x );
		this.bounds.min.y = Math.min( this.bounds.min.y, triangle.a.y, triangle.b.y, triangle.c.y );
		this.bounds.min.z = Math.min( this.bounds.min.z, triangle.a.z, triangle.b.z, triangle.c.z );
		this.bounds.max.x = Math.max( this.bounds.max.x, triangle.a.x, triangle.b.x, triangle.c.x );
		this.bounds.max.y = Math.max( this.bounds.max.y, triangle.a.y, triangle.b.y, triangle.c.y );
		this.bounds.max.z = Math.max( this.bounds.max.z, triangle.a.z, triangle.b.z, triangle.c.z );

		this.triangles.push( triangle );

		return this;

	}*/

	initiatePosition(cameraPos, distance){
		if ( ! this.bounds ) this.bounds = new Box3();//box对象
		this.bounds.min.x = cameraPos.x - distance;
		this.bounds.min.y = cameraPos.y - distance;
		this.bounds.min.z = cameraPos.z - distance;
		this.bounds.max.x = cameraPos.x + distance;
		this.bounds.max.y = cameraPos.y + distance;
		this.bounds.max.z = cameraPos.z + distance;
	}


	addObject( point, num){ //看成一个点
		//if ( ! this.bounds ) this.bounds = new Box3();//box对象
		//bounds边界，新加进来点后更新边界 因此min取小，max取大
		//this.bounds.min.x = Math.min( this.bounds.min.x, point.x );
		//this.bounds.min.y = Math.min( this.bounds.min.y, point.y );
		//this.bounds.min.z = Math.min( this.bounds.min.z, point.z );
		//this.bounds.max.x = Math.max( this.bounds.max.x, point.x );
		//this.bounds.max.y = Math.max( this.bounds.max.y, point.y );
		//this.bounds.max.z = Math.max( this.bounds.max.z, point.z );
		/*this.bounds.min.x=-5;
		this.bounds.min.y=-5;
		this.bounds.min.z=-5;
		this.bounds.max.x=5;
		this.bounds.max.y=5;
		this.bounds.max.z=5;*/


        //this.box=this.box.clone();
		this.points.push( point );
		this.nums.push( num );
		//console.log(1111)

		return this;

	}

	calcBox() {

		//this.bounds = new Box3()
		this.box = this.bounds.clone();

		// offset small amount to account for regular grid
		this.box.min.x -= 0.01;
		this.box.min.y -= 0.01;
		this.box.min.z -= 0.01;

		return this;

	}

	split( level ) {

		this.tempNums=[];

		//console.log(this.box)
		//console.log(this.points)

		if ( ! this.box ) return;

		const subTrees = [];
		const halfsize = _v2.copy( this.box.max ).sub( this.box.min ).multiplyScalar( 0.5 );//划分空间box

		for ( let x = 0; x < 2; x ++ ) {

			for ( let y = 0; y < 2; y ++ ) {

				for ( let z = 0; z < 2; z ++ ) {

					const box = new Box3();
					const v = _v1.set( x, y, z );

					box.min.copy( this.box.min ).add( v.multiply( halfsize ) );
					box.max.copy( box.min ).add( halfsize );

					subTrees.push( new Octree( box ) );//添加分支树//分支树中每个节点所包含的数据内容都是box空间划分

				}

			}

		}

		//let triangle;
		let point;
		let num;

		while ( point = this.points.pop() ) {//弹出一个物体点
			num = this.nums.pop();//

			for ( let i = 0; i < subTrees.length; i ++ ) {//顺序搜索分支子树

				//if ( subTrees[ i ].box.intersectsNode( point ) ) {//判断此空间划分是否与此物体点有重合//
				//console.log(point)

				//console.log(subTrees[i].box)
				if ( point.x <= subTrees[i].box.max.x & point.x >= subTrees[i].box.min.x & point.y <= subTrees[i].box.max.y & point.y >= subTrees[i].box.min.y & point.z <= subTrees[i].box.max.z & point.z >= subTrees[i].box.min.z){
                    console.log(123)
					console.log(num)
					this.tempNums.push(num);
					subTrees[ i ].points.push( point );//将与此box空间划分有重合的物体点放入此分支树中
					subTrees[ i ].nums.push( num );

				}

			}

		}

		for ( let i = 0; i < subTrees.length; i ++ ) {

			const len = subTrees[ i ].points.length;

			if ( len > 8 && level < 16 ) {//??????level限制高度？

				subTrees[ i ].split( level + 1 );//对于octree类型操作

			}

			if ( len !== 0 ) {

				this.subTrees.push( subTrees[ i ] );

			}

		}

		//return this;
		return this.tempNums;

	}

	build() {

		this.calcBox();//
		this.split( 0 );

		return this;

	}

	getRayTriangles( ray, triangles ) {

		for ( let i = 0; i < this.subTrees.length; i ++ ) {

			const subTree = this.subTrees[ i ];
			if ( ! ray.intersectsBox( subTree.box ) ) continue;

			if ( subTree.triangles.length > 0 ) {

				for ( let j = 0; j < subTree.triangles.length; j ++ ) {

					if ( triangles.indexOf( subTree.triangles[ j ] ) === - 1 ) triangles.push( subTree.triangles[ j ] );

				}

			} else {

				subTree.getRayTriangles( ray, triangles );

			}

		}

		return triangles;

	}

	triangleCapsuleIntersect( capsule, triangle ) {

		triangle.getPlane( _plane );

		const d1 = _plane.distanceToPoint( capsule.start ) - capsule.radius;
		const d2 = _plane.distanceToPoint( capsule.end ) - capsule.radius;

		if ( ( d1 > 0 && d2 > 0 ) || ( d1 < - capsule.radius && d2 < - capsule.radius ) ) {

			return false;

		}

		const delta = Math.abs( d1 / ( Math.abs( d1 ) + Math.abs( d2 ) ) );
		const intersectPoint = _v1.copy( capsule.start ).lerp( capsule.end, delta );

		if ( triangle.containsPoint( intersectPoint ) ) {

			return { normal: _plane.normal.clone(), point: intersectPoint.clone(), depth: Math.abs( Math.min( d1, d2 ) ) };

		}

		const r2 = capsule.radius * capsule.radius;

		const line1 = _line1.set( capsule.start, capsule.end );

		const lines = [
			[ triangle.a, triangle.b ],
			[ triangle.b, triangle.c ],
			[ triangle.c, triangle.a ]
		];

		for ( let i = 0; i < lines.length; i ++ ) {

			const line2 = _line2.set( lines[ i ][ 0 ], lines[ i ][ 1 ] );

			const [ point1, point2 ] = capsule.lineLineMinimumPoints( line1, line2 );

			if ( point1.distanceToSquared( point2 ) < r2 ) {

				return { normal: point1.clone().sub( point2 ).normalize(), point: point2.clone(), depth: capsule.radius - point1.distanceTo( point2 ) };

			}

		}

		return false;

	}

	triangleSphereIntersect( sphere, triangle ) {

		triangle.getPlane( _plane );

		if ( ! sphere.intersectsPlane( _plane ) ) return false;

		const depth = Math.abs( _plane.distanceToSphere( sphere ) );
		const r2 = sphere.radius * sphere.radius - depth * depth;

		const plainPoint = _plane.projectPoint( sphere.center, _v1 );

		if ( triangle.containsPoint( sphere.center ) ) {

			return { normal: _plane.normal.clone(), point: plainPoint.clone(), depth: Math.abs( _plane.distanceToSphere( sphere ) ) };

		}

		const lines = [
			[ triangle.a, triangle.b ],
			[ triangle.b, triangle.c ],
			[ triangle.c, triangle.a ]
		];

		for ( let i = 0; i < lines.length; i ++ ) {

			_line1.set( lines[ i ][ 0 ], lines[ i ][ 1 ] );
			_line1.closestPointToPoint( plainPoint, true, _v2 );

			const d = _v2.distanceToSquared( sphere.center );

			if ( d < r2 ) {

				return { normal: sphere.center.clone().sub( _v2 ).normalize(), point: _v2.clone(), depth: sphere.radius - Math.sqrt( d ) };

			}

		}

		return false;

	}

	getSphereTriangles( sphere, triangles ) {

		for ( let i = 0; i < this.subTrees.length; i ++ ) {

			const subTree = this.subTrees[ i ];

			if ( ! sphere.intersectsBox( subTree.box ) ) continue;

			if ( subTree.triangles.length > 0 ) {

				for ( let j = 0; j < subTree.triangles.length; j ++ ) {

					if ( triangles.indexOf( subTree.triangles[ j ] ) === - 1 ) triangles.push( subTree.triangles[ j ] );

				}

			} else {

				subTree.getSphereTriangles( sphere, triangles );

			}

		}

	}

	getCapsuleTriangles( capsule, triangles ) {

		for ( let i = 0; i < this.subTrees.length; i ++ ) {

			const subTree = this.subTrees[ i ];

			if ( ! capsule.intersectsBox( subTree.box ) ) continue;

			if ( subTree.triangles.length > 0 ) {

				for ( let j = 0; j < subTree.triangles.length; j ++ ) {

					if ( triangles.indexOf( subTree.triangles[ j ] ) === - 1 ) triangles.push( subTree.triangles[ j ] );

				}

			} else {

				subTree.getCapsuleTriangles( capsule, triangles );

			}

		}

	}

	sphereIntersect( sphere ) {

		_sphere.copy( sphere );

		const triangles = [];
		let result, hit = false;

		this.getSphereTriangles( sphere, triangles );

		for ( let i = 0; i < triangles.length; i ++ ) {

			if ( result = this.triangleSphereIntersect( _sphere, triangles[ i ] ) ) {

				hit = true;

				_sphere.center.add( result.normal.multiplyScalar( result.depth ) );

			}

		}

		if ( hit ) {

			const collisionVector = _sphere.center.clone().sub( sphere.center );
			const depth = collisionVector.length();

			return { normal: collisionVector.normalize(), depth: depth };

		}

		return false;

	}

	capsuleIntersect( capsule ) {

		_capsule.copy( capsule );

		const triangles = [];
		let result, hit = false;

		this.getCapsuleTriangles( _capsule, triangles );

		for ( let i = 0; i < triangles.length; i ++ ) {

			if ( result = this.triangleCapsuleIntersect( _capsule, triangles[ i ] ) ) {

				hit = true;

				_capsule.translate( result.normal.multiplyScalar( result.depth ) );

			}

		}

		if ( hit ) {

			const collisionVector = _capsule.getCenter( new Vector3() ).sub( capsule.getCenter( _v1 ) );
			const depth = collisionVector.length();

			return { normal: collisionVector.normalize(), depth: depth };

		}

		return false;

	}

	rayIntersect( ray ) {

		if ( ray.direction.length() === 0 ) return;

		const triangles = [];
		let triangle, position, distance = 1e100;

		this.getRayTriangles( ray, triangles );

		for ( let i = 0; i < triangles.length; i ++ ) {

			const result = ray.intersectTriangle( triangles[ i ].a, triangles[ i ].b, triangles[ i ].c, true, _v1 );

			if ( result ) {

				const newdistance = result.sub( ray.origin ).length();

				if ( distance > newdistance ) {

					position = result.clone().add( ray.origin );
					distance = newdistance;
					triangle = triangles[ i ];

				}

			}

		}

		return distance < 1e100 ? { distance: distance, triangle: triangle, position: position } : false;

	}

	fromGraphNode( group ) {

		group.updateWorldMatrix( true, true );

		group.traverse( ( obj ) => {

			if ( obj.isMesh === true ) {

				let geometry, isTemp = false;

				if ( obj.geometry.index !== null ) {

					isTemp = true;
					geometry = obj.geometry.toNonIndexed();

				} else {

					geometry = obj.geometry;

				}

				const positionAttribute = geometry.getAttribute( 'position' );

				for ( let i = 0; i < positionAttribute.count; i += 3 ) {

					const v1 = new Vector3().fromBufferAttribute( positionAttribute, i );
					const v2 = new Vector3().fromBufferAttribute( positionAttribute, i + 1 );
					const v3 = new Vector3().fromBufferAttribute( positionAttribute, i + 2 );

					v1.applyMatrix4( obj.matrixWorld );
					v2.applyMatrix4( obj.matrixWorld );
					v3.applyMatrix4( obj.matrixWorld );

					this.addTriangle( new Triangle( v1, v2, v3 ) );

				}

				if ( isTemp ) {

					geometry.dispose();

				}

			}

		} );

		this.build();

		return this;

	}

}

export { Octree };