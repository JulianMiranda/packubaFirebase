import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { Subcategory } from '../../dto/subcategory.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';

@Injectable()
export class SubcategoryRepository {
  readonly type = ENTITY.SUBCATEGORY;

  constructor(
    @InjectModel('Subcategory') private subcategoryDb: Model<Subcategory>,
    private imageRepository: ImageRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, subcategories] = await Promise.all([
        this.subcategoryDb.countDocuments(filter),
        this.subcategoryDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: subcategories };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter subcategories Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Subcategory> {
    try {
      const document = await this.subcategoryDb.findOne({ _id: id }).populate([
        {
          path: 'images',
          match: { status: true },
          select: { url: true },
        },
        {
          path: 'category',
          select: { name: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find subcategory for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findSubcategory Database error',
          e,
        );
    }
  }
  async getProduct(id: string): Promise<Subcategory> {
    try {
      const document = await this.subcategoryDb.findOne({ _id: id }).populate([
        {
          path: 'images',
          match: { status: true },
          select: { url: true },
        },
        {
          path: 'category',
          select: { name: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find subcategory for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findSubcategory Database error',
          e,
        );
    }
  }

  async create(
    data: Subcategory,
    images: Array<Partial<Image>>,
  ): Promise<boolean> {
    try {
      const newSubcategory = new this.subcategoryDb(data);
      if (!images) {
        const subcategory = await newSubcategory.save();

        return !!subcategory;
      } else {
        const document = await newSubcategory.save();

        const createImages = images.map((image) => {
          image.parentType = this.type;
          image.parentId = document._id;
          return image;
        });
        const imageModel = await this.imageRepository.insertImages(
          createImages,
        );

        const newImages = imageModel.map((doc) => doc._id);

        const subcategory = await this.subcategoryDb.findOneAndUpdate(
          { _id: document._id },
          { images: newImages },
          { new: true },
        );

        return !!subcategory;
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'createSubcategory Database error',
        e,
      );
    }
  }

  async update(
    id: string,
    data: Partial<Subcategory>,
    images: Array<Partial<Image>>,
    deleteImages: string[],
  ): Promise<boolean> {
    try {
      if (images || deleteImages) {
        const storedImages = await this.subcategoryDb
          .findOne({ _id: id }, { images: true, _id: false })
          .lean();

        let newImages = [];
        if (images && images.length > 0) {
          const createImages = images.map((image) => {
            image.parentType = this.type;
            image.parentId = id;
            return image;
          });

          const imageModel = await this.imageRepository.insertImages(
            createImages,
          );
          newImages = imageModel.map((doc) => doc._id);
        }

        if (deleteImages && deleteImages.length > 0) {
          this.imageRepository.deleteImages(deleteImages);

          data.images = [...storedImages.images, ...newImages]
            .map((imageId) => imageId.toString())
            .filter((imageId) => deleteImages.indexOf(imageId) === -1);
        } else if (newImages.length > 0) {
          data.images = [...storedImages.images, ...newImages];
        }
      }
      const document = await this.subcategoryDb
        .findOneAndUpdate({ _id: id }, data, { new: true })
        .populate([
          { path: 'unit', select: { name: true } },
          {
            path: 'images',
            match: { status: true },
            select: { url: true },
          },
        ]);

      if (!document)
        throw new NotFoundException(
          `Could not find subcategory to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updateSubcategory Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.subcategoryDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find subcategory to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteSubcategory Database error',
        e,
      );
    }
  }
  async setPrice(): Promise<boolean> {
    try {
      const subcat = await this.subcategoryDb.find();
      subcat.map(async (item) => {
        await this.subcategoryDb.findByIdAndUpdate(item.id, {
          price: Math.floor(Math.random() * 10),
        });
      });

      return true;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteSubcategory Database error',
        e,
      );
    }
  }
}
