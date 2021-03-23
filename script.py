from PIL import Image

#imgs = ["Content_Dungeon.png", "Content_CorruptedDungeon.png", "Content_Quest.png", "Merchant_Emerald.png", "NPC_Blacksmith.png", "NPC_ItemIdentifier.png", "NPC_PowderMaster.png", "Merchant_Potion.png", "Merchant_Armour.png", "Merchant_Weapon.png", "Merchant_Liquid.png", "Merchant_Other.png", "Merchant_Scroll.png", "Merchant_Accessory.png", "Merchant_Tool.png", "painting.png", "Profession_Weaponsmithing.png", "Profession_Armouring.png", "Profession_Alchemism.png", "Profession_Jeweling.png", "Profession_Tailoring.png", "Profession_Scribing.png", "Profession_Cooking.png", "Profession_Woodworking.png", "Content_Miniquest.png", "Special_RootsOfCorruption.png", "Special_FastTravel.png", "Special_LightRealm.png", "Special_Rune.png", "Content_UltimateDiscovery.png", "Merchant_KeyForge.png", "NPC_GuildMaster.png", "Content_GrindSpot.png", "Content_Cave.png", "NPC_TradeMarket.png", "Content_BossAltar.png", "Content_Raid.png", "Merchant_Dungeon.png", "tnt.png", "Merchant_Seasail.png", "Merchant_Horse.png"]
imgs = ["Merchant_Emerald.png", "NPC_Blacksmith.png", "NPC_ItemIdentifier.png", "NPC_PowderMaster.png", "Merchant_Potion.png", "Merchant_Armour.png", "Merchant_Weapon.png", "Merchant_Liquid.png", "Merchant_Other.png", "Merchant_Scroll.png", "Merchant_Accessory.png", "Merchant_Tool.png", "painting.png", "Profession_Weaponsmithing.png", "Profession_Armouring.png", "Profession_Alchemism.png", "Profession_Jeweling.png", "Profession_Tailoring.png", "Profession_Scribing.png", "Profession_Cooking.png", "Profession_Woodworking.png", "Special_RootsOfCorruption.png", "Special_LightRealm.png", "Content_UltimateDiscovery.png", "Merchant_KeyForge.png", "NPC_GuildMaster.png", "Content_GrindSpot.png", "NPC_TradeMarket.png", "Content_Raid.png", "Merchant_Dungeon.png", "tnt.png", "Merchant_Seasail.png", "Merchant_Horse.png"]

im1 = Image.open("./media/icons/maplocstemp/Content_GrindSpot.png") 
for name in imgs:
    img = im1.copy()  
    img.save("./media/icons/maplocstemp/" + name, "PNG")

# img = Image.new(mode = "RGB", size = (32,32))
# img.putalpha(0)
# for name in imgs:
#     img.save("./media/icons/maplocstemp/" + name, "PNG")
