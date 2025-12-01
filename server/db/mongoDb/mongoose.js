import process from "node:process";
import mongoose, {Schema, Model} from 'mongoose';
import {IS_PRODUCTION} from "./../../utils/contants.js";
import {Router} from "express";

mongoose.plugin(schema => {
	const existingToJSON = schema.get('toJSON') || {};

	schema.set('toJSON', {
		...existingToJSON,
		versionKey: false,
		transform: (doc, ret) => {
			if (existingToJSON.transform) existingToJSON.transform(doc, ret)

			if (ret.updatedAt) delete ret.updatedAt;
			if (ret.createdAt) delete ret.createdAt;

			return ret;
		}
	})

	schema.statics.updateOneSet = function (selectors, options) {
		function buildSetObject(updates, prefix = '') {
			const setObject = {};

			Object.keys(updates).forEach(key => {
				const fullPath = prefix ? `${prefix}.${key}` : key;
				const value = updates[key];

				if (value && typeof value === 'object' &&
						!Array.isArray(value) &&
						!(value instanceof Date)) {
					// Recursivamente convertir objetos anidados a notación de puntos
					Object.assign(setObject, buildSetObject(value, fullPath));
				} else {
					setObject[fullPath] = value;
				}
			});

			return setObject;
		}

		// return this.updateOne({_id: req.body._id}, {
		return this.updateOne(selectors, {

			$set: buildSetObject({
				// ...req.body,
				...options,
				_id: undefined
			})
		})
	}

	schema.statics.getEndpoints = function () {
		const router = Router({strict: true});
		const modelName = this.modelName.toLowerCase();


		const check = (schema, basePath = '') => {
			console.log('creating route for ', basePath)
			const subRouter = Router({strict: true});
			const route = router.use(basePath, subRouter);
			subRouter.checkout('/', (req, res) => {
				try {
					// Create temporary model instance to validate
					const TempModel = mongoose.model('TempModel', schema);
					const tempDoc = new TempModel(req.body);

					// Validate against schema
					const validationError = tempDoc.validateSync();
					if (validationError) {
						return res.status(400).json(validationError);
					}

					// Schema is valid
					return res.status(200).send()

				} catch (error) {
					return res.status(500).json({
						error: true,
						message: error.message
					});
				} finally {
					// Clean up temporary model
					delete mongoose.models['TempModel'];
				}
			})

			subRouter.trace('/',(req, res) => {
				res.send(schema.obj)
			})

			subRouter.get('/all', (req, res) => {
				const filter = req.query ? Object.fromEntries(
						Object.entries(req.query).filter(([_, value]) => value !== undefined)
				) : {};

				this.find(filter)
						.sort()
						.then(docs => res.send(docs))
			})

			Object.entries(schema.obj).forEach(([key, value]) => {
				if (value instanceof Array) {
					const v = value[0]
					if (v instanceof mongoose.Schema) {
						check(v, `${basePath}/${key}`)
					}
					return;
				}

				if (value.type instanceof mongoose.Schema) {
					check(value.type, `${basePath}/${key}`)
				}
			})
		}

		check(this.schema, `/${modelName}`)
		return router
	}
})

export const mongooseConnect = ()=> {
	const cs = IS_PRODUCTION
			? `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@zenit-test-shard-00-00.ywuvq.mongodb.net:27017,zenit-test-shard-00-01.ywuvq.mongodb.net:27017,zenit-test-shard-00-02.ywuvq.mongodb.net:27017/${process.env.MONGODB_DATABASE}?replicaSet=atlas-gfu6mk-shard-0&ssl=true&authSource=admin`
			// ? `mongodb+srv://${Deno.env.get('MONGODB_USERNAME')}:${process.env.MONGODB_PASSWORD}@zenit-test.ywuvq.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=zenit-test`
			: "mongodb://localhost:27017/Johan"

	mongoose.connect(cs)
			.then((_r) => {
				console.log("Connected to MongoDB");
			})
			.catch((e) => {
				console.error("Error connecting to MongoDB: ", e);
			})
}
