const Brand = require('../models/Brand/brand.schema');
const ArchiveBrand = require('../models/Brand/archiveBrand.schema');

const moveDeletedBrandsToArchive = async () => {
  const session = await Brand.startSession();
  try {
    session.startTransaction();
    const deletedRecords = await Brand.find({ isDeleted: true }, null, {
      session,
    }).lean();

    if (!deletedRecords.length) {
      await session.abortTransaction();
      return {
        success: true,
        message: 'No deleted brands found to archive',
        count: 0,
      };
    }
    const recordsToArchive = deletedRecords.map((record) => ({
      ...record,
      archivedAt: new Date(),
    }));

    await ArchiveBrand.insertMany(recordsToArchive, { session });
    await Brand.deleteMany({ isDeleted: true }, { session });

    await session.commitTransaction();

    return {
      success: true,
      message: `Successfully archived ${deletedRecords.length} brand records`,
      count: deletedRecords.length,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Brand archiving failed:', error.message);
    return {
      success: false,
      message: `Failed to archive brands: ${error.message}`,
    };
  } finally {
    session.endSession();
  }
};
module.exports = { moveDeletedBrandsToArchive };
