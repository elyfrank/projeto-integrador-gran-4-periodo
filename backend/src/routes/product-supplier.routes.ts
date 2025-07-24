import {Router} from 'express';
import * as productSupplierController from '../controllers/product-supplier.controller';

const router = Router();

router.get('/product/:productId/suppliers', productSupplierController.getSuppliersByProduct);
router.post('/', productSupplierController.addSupplierToProduct);
router.delete('/', productSupplierController.deteleSupplierProduct);


export default router;
